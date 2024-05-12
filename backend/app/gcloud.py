from google.cloud import storage
import base64

class GCSUploader:
	
	def __init__(self, credentials):
		self.client = storage.Client(credentials=credentials)


	def upload(self, content, bucket_name, destination_blob_name, mime_type, is_base64=False):
			bucket = self.client.bucket(bucket_name)
			blob = bucket.blob(destination_blob_name)
			blob.content_type = mime_type
			if is_base64:
				# Decode the base64 string to bytes if specified
				content = base64.b64decode(content)

			# Upload the content to Google Cloud Storage
			blob.upload_from_string(content, content_type=mime_type)
			print("Upload complete.")