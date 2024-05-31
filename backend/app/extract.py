"""Copyright(c) David Rueter All rights reserved. This program is made
available under the terms of the AGPLv3 license. See the LICENSE file in the project root for more information. """

import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os

# If modifying these SCOPES, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_credentials():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds


def extract_spreadsheet_data(creds, spreadsheet_id):
    service = build('sheets', 'v4', credentials=creds)

    # Retrieve the list of sheets in the spreadsheet.
    sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    sheets = sheet_metadata.get('sheets', '')

    all_data = {}

    for sheet in sheets:
        title = sheet.get('properties', {}).get('title')
        range_name = f'{title}'


        # Request a range of data.
        result = service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        rows = result.get('values', [])

        if not rows:
            print(f'No data found in sheet: {title}')
        else:
            # Store the sheet data in a dictionary.
            headers = rows[0]
            data = []
            last_first_column_value = None # first column may have values omitted, copy from previous.

            for index, row in enumerate(rows[1:]):
                if all(value is None for value in row):
                    continue
                row += [None] * (len(headers) - len(row))
                if not row[0]:
                    row[0] = last_first_column_value
                else:
                    last_first_column_value = row[0]
                obj = dict(zip(headers, row))
                obj["id"] = f"{title}-{index}"
                data.append(obj)
                
            all_data[title] = data
    return all_data

def main():
    spreadsheet_id = 'your-spreadsheet-id-here'
    data = extract_spreadsheet_data(get_credentials(), spreadsheet_id)
    with open('spreadsheet_data.json', 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == '__main__':
    main()
