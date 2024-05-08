from flask import Flask, request, jsonify, send_from_directory, Response
from openai import OpenAI
from google.oauth2.service_account import Credentials
from google.cloud.exceptions import NotFound, Forbidden
from flask_cors import CORS


import uuid
import os
import extract
#from flask_cors import CORS
import json
from string import Template
import traceback
from pathlib import Path
from gcloud import GCSService
from image_gen import generateImage;
from safe import walk_json

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
		  'https://www.googleapis.com/auth/gmail.send']


app = Flask(__name__)
#CORS(app)

def getCredentials():
	config_json = os.getenv('SHEETS_SERVICE_ACCOUNT_CONFIG')
	if config_json:
		print("Loading service account credentials from env variable.")
		return Credentials.from_service_account_info( json.loads(config_json))
	else:
		return Credentials.from_service_account_file(
		app.config.get("service-account-file"),
		scopes=SCOPES
)

with open('./config.json', 'r') as config:
	app.config.update(json.load(config))
	

params_file_name = 'parameters.json'
params_dir = './'	
parameters = {}
all_prompts = set({})

openai_api_key = os.environ.get("OPENAI_API_KEY")

if not openai_api_key:
	print("OPENAI_API_KEY env variable required.")
	exit(-1)
	
client = OpenAI(
	api_key=openai_api_key.strip(),
)

def loadRecipeTemplates():
	return Path('./recipe.html').read_text().split("<!-- CONTENT -->"), Template(Path('./image.html').read_text())

recipeSegments, imageTemplate = loadRecipeTemplates()

credentials = getCredentials()

gcs_service = GCSService(credentials)

upload_uri_base = f"https://storage.googleapis.com/{app.config.get('bucket-name')}/"


def extract_parameters_impl():
	print("Retrieving parameters JSON from Google Sheets API...")
	return extract.extract_spreadsheet_data(credentials, app.config.get("spreadsheet-id"))

@app.route('/api/extract', methods=['GET'])
def extract_parameters():
	return jsonify(extract_parameters_impl())

def upload(parameters, bucket_name):
	gcs_service.upload(json.dumps(parameters), bucket_name, params_file_name, "text/json")

def set_parameters(newParameters):
	global parameters
	global all_prompts
	parameters = newParameters
	## all RecipeOption and ingredient prompts go in all_prompts
	for item in parameters['options']:
		all_prompts.add(item['prompt'])
	
	for item in parameters['Food Forest Ingredient']:
		all_prompts.add(item['ABREVIATION (20-25 ch)'])
		
def ensure_params_exists():
	global parameters
	# Exit early if params exists
	if parameters:
		return
	
	bucket_name = app.config.get('bucket-name')
	try:
		bucket_name = app.config.get('bucket-name')
		data = gcs_service.get_bytes(bucket_name, params_file_name)
		new_params = json.loads(data.decode('utf-8'))
	except (NotFound, Forbidden) as e :
		print(f"{params_file_name} not found in bucket {bucket_name}, e={e} loading from Google Sheets...")
		new_params = extract_parameters_impl()
		upload(new_params, bucket_name)
	set_parameters(new_params)


ensure_params_exists()


def safe_params(request):
	unsafe_params = walk_json(request, all_prompts, {"type"})
	if len(unsafe_params) > 0:
		raise Exception(f"Unsafe parameters found: {unsafe_params}")
			

def stringify_key(values, key):
	if key in values:
		values[key] = ",".join(values[key]) # substitute for string.


@app.route('/api/generate', methods=['POST'])
def generate_text():
	if not request.is_json:
		return jsonify({"error": "Request must be JSON"}), 400
	if not parameters:
		return jsonify({"error": "Prompt configuration not loaded."}), 400

	try:
		print(f"starting")

		requestArg = request.get_json()
		print (requestArg)
		type = requestArg['type']
		print(f"prompttype {type}")
		prompts = parameters["prompt-templates"]
		promptTemplateDef = [prompt for prompt in prompts if prompt['type'] == type]
		if len(promptTemplateDef) < 1:
			return jsonify({"error": f"Prompt configuration {type} not found."}), 400
		
		promptText = promptTemplateDef[0]["prompt"] + app.config.get("prompt-footer", "")
		promptTemplate = Template( promptText)
		safe_params(requestArg) # check to make sure nobody's messing	 with the prompt
		
		values = requestArg
		stringify_key(values, 'ingredients')
			
		stringify_key(values, 'accommodations')
		
		try:
			filledPrompt = promptTemplate.substitute(values) # fill in the template
		except KeyError as e:
			print(f"Error: Missing key {e}")
		
		chat_completion = client.chat.completions.create(
			messages=[
				{
					"role": "user",
					"content": filledPrompt,
				}
			],
			model=app.config.get("model"),
			stream=True,
		)
		id = uuid.uuid4()
		
		# Generator for the response
		def generate():
			yield recipeSegments[0] # return the first part of the recipe
			recipeChunks = []
			for chunk in chat_completion: # stream the openai response
				content = chunk.choices[0].delta.content
				if content != None:
					recipeChunks.append(content)
					yield content
			print("Done with responses.")
			yield recipeSegments[1]
			# FIXME use a random image prompt
			image_data = generateImage(client, parameters["IMAGE PROMPTS"][0]["Prompts"], "".join(recipeChunks))
			image_name =  f"{id}.jpeg"
			gcs_service.upload(image_data, app.config.get('bucket-name'), image_name,"image/jpeg")
			print(f"Uploaded image {image_name}")
			yield imageTemplate.substitute({"imgsrc":upload_uri_base + image_name})
			yield recipeSegments[2]
				
		return Response(save_and_pass(generate(), gcs_service, f"{id}.html"), mimetype='text/html')
	except Exception as e:
			print(f"ERROR: {e}")
			traceback.print_exception(e)
			print(jsonify({"error": str(e), "ex": traceback.format_exception(e)}))
			return jsonify({"error": "There was a server error."}), 500
	
@app.route('/api/parameters', methods=['GET'])
def get_parameters():

	ensure_params_exists()
			
	return jsonify(parameters)

def save_and_pass(generator, uploader, filename):
	# Accumulate content from the generator
	content = []
	for chunk in generator:
		content.append(chunk)
		yield chunk  # You can still yield the chunk to a response

	complete_content = ''.join(content)
	uploader.upload(complete_content, app.config.get('bucket-name'), filename, "text/html")



if __name__ == '__main__':
	CORS(app, resources={r"/*": {"origins": "http://localhost:8100"}})
	app.run(debug=True, host="0.0.0.0", port="5001")
