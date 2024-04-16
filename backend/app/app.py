from flask import Flask, request, jsonify, send_from_directory
from openai import OpenAI
import os
import extract
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

spreadsheet_id = '1kLVqLL64OQNjpYVZQokzUlawOFHI2g19KMSHPbVLrgU' # FIXME parameterize me

@app.route('/generate', methods=['POST'])
def generate_text():
	if not request.is_json:
		return jsonify({"error": "Request must be JSON"}), 400

	content = request.get_json()
	
	client = OpenAI(
		# This is the default and can be omitted
		api_key=os.environ.get("OPENAI_API_KEY"),
	)
	try:
		chat_completion = client.chat.completions.create(
			messages=[
				{
					"role": "user",
					"content": content.get('prompt', ''),
				}
			],
			model="gpt-3.5-turbo",
		)
		return jsonify(chat_completion.choices[0].message.content)
	except Exception as e:
			return jsonify({"error": str(e)}), 500
	
@app.route('/extract', methods=['GET'])
def extractParameters():
	return jsonify(extract.extract_spreadsheet_data(spreadsheet_id))

@app.route('/parameters', methods=['GET'])
def parameters():
	params_file_name = 'parameters.json'
	params_dir = './'
	path = os.path.join(params_dir, params_file_name)
	if not os.path.exists(path):
		
		with open(path, 'w') as file:
			parameters = extractParameters().get_data(as_text=True)
			file.write(parameters)
			
	return send_from_directory(params_dir, params_file_name)




if __name__ == '__main__':
	app.run(debug=True, host="0.0.0.0", port="8080")