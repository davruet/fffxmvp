""" Copyright(c) David Rueter All rights reserved. This program is made
available under the terms of the AGPLv3 license. See the LICENSE file in the project root for more information. """
import base64
import logging
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import google.auth

def create_message(sender, to, subject, message_text_html):
    """Create a message for an email."""
    message = MIMEMultipart('alternative')
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    msg = MIMEText(message_text_html, 'html')
    message.attach(msg)
    raw = base64.urlsafe_b64encode(message.as_bytes())
    raw = raw.decode()
    return {'raw': raw}

def send_message(user_id, message, credentials):
    creds, _ = google.auth.default()
    service = build('gmail', 'v1', credentials=creds)
    print("built service.")
    """Send an email message."""
    try:
        message = (service.users().messages().send(userId="me", body=message)
                   .execute())
        print('Message Id: %s' % message['id'])
        return message
    except HttpError as error:
        logging.error("email send error occurred: %s", str(error))
        raise

def main():
    # Set up the Gmail API service
    service = build('gmail', 'v1', credentials=credentials)

    sender = 'your-email@gmail.com'
    to = 'recipient-email@gmail.com'
    subject = 'Hello World'
    message_text_html = '<h1>Hello, world!</h1>'

    # Create the email
    message = create_message(sender, to, subject, message_text_html)

    # Send the email
    send_message(service, 'me', message)

if __name__ == '__main__':
    main()