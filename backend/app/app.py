from flask import Flask, request, jsonify, send_from_directory
import openai
import os
import extract

app = Flask(__name__)

openai.api_key = os.getenv('OPENAI_API_KEY')
spreadsheet_id = '1kLVqLL64OQNjpYVZQokzUlawOFHI2g19KMSHPbVLrgU' # FIXME parameterize me

@app.route('/generate', methods=['POST'])
def generate_text():
	if not request.is_json:
		return jsonify({"error": "Request must be JSON"}), 400

	content = request.get_json()

	# Assuming the JSON object has a key 'prompt' to use as the OpenAI prompt
	prompt_text = content.get('prompt', '')
	if not prompt_text:
		return jsonify({"error": "JSON must include a 'prompt' key"}), 400

	try:
		# Call OpenAI API
		response = openai.Completion.create(engine="text-davinci-003", prompt=prompt_text, max_tokens=100)
		return jsonify({"response": response.choices[0].text.strip()})
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
	app.run(debug=True, host="0.0.0.0", port="5001")