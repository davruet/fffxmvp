from io import BytesIO
from PIL import Image
import base64

def generateImage(client, imagePrompt, prompt, format="JPEG"):
	finalPrompt = imagePrompt + "\n" + prompt
	trimmedPrompt = finalPrompt[:4000]
	response = client.images.generate(
		model="dall-e-3",
		style="natural",
		prompt=trimmedPrompt,
		size="1024x1024",
		quality="standard",
		n=1,
		response_format="b64_json"
	)
	png_data = base64.b64decode( response.data[0].b64_json)
	if format == "PNG":
		return png_data
	else :
		with Image.open(BytesIO(png_data)) as img:
			rgb_img = img.convert('RGB')
			jpeg_buffer = BytesIO()
			rgb_img.save(jpeg_buffer, format=format)
			return jpeg_buffer.getvalue()