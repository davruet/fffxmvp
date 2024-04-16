from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
from google.oauth2.service_account import Credentials
import os
import extract
from flask_cors import CORS
import json
from string import Template
import traceback

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


app = Flask(__name__)
CORS(app)

with open('./config.json', 'r') as config:
	app.config.update(json.load(config))
	
		
credentials = Credentials.from_service_account_file(
    app.config.get("service-account-file"),
    scopes=SCOPES
)

params_file_name = 'parameters.json'
params_dir = './'	
parameters = {}

def extract_parameters_impl():
	return extract.extract_spreadsheet_data(credentials, app.config.get("spreadsheet-id"))

@app.route('/extract', methods=['GET'])
def extract_parameters():
	return jsonify(extract_parameters_impl())


def ensure_params_exists():
	global parameters
	path = os.path.join(params_dir, params_file_name)
	if not os.path.exists(path):
		print(f"{path} not found, loading from Google Sheets...")
		with open(path, 'w') as file:
			parameters = json.dumps(extract_parameters_impl())
			file.write(parameters)
	else:
		print("Opening params file.")
		with open(path, "r") as file:
			parameters = json.load(file)


ensure_params_exists()


@app.route('/generate', methods=['POST'])
def generate_text():
	if not request.is_json:
		return jsonify({"error": "Request must be JSON"}), 400
	if not parameters:
		return jsonify({"error": "Prompt configuration not loaded."}), 400

	try:
		requestArg = request.get_json()
		type = requestArg['type']
		print(f"prompttype {type}")
		prompts = parameters["prompt-templates"]
		promptTemplateDef = [prompt for prompt in prompts if prompt['type'] == type]
		if len(promptTemplateDef) < 1:
			return jsonify({"error": f"Prompt configuration {type} not found."}), 400
		
		promptTemplate = Template(promptTemplateDef[0]["prompt"])
		filledPrompt = promptTemplate.substitute(requestArg) # fill in the template
		
		client = OpenAI(
			# This is the default and can be omitted
			api_key=os.environ.get("OPENAI_API_KEY"),
		)
		
		chat_completion = client.chat.completions.create(
			messages=[
				{
					"role": "user",
					"content": filledPrompt,
				}
			],
			model="gpt-3.5-turbo",
		)
		return jsonify(chat_completion.choices[0].message.content)
	except Exception as e:
			return jsonify({"error": str(e), "ex": traceback.format_exception(e)}), 500
	
@app.route('/parameters', methods=['GET'])
def get_parameters():

	ensure_params_exists()
			
	return send_from_directory(params_dir, params_file_name)



if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0", port="8080")