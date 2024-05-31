#!/bin/bash

#Copyright(c) David Rueter All rights reserved. This program is made
#available under the terms of the AGPLv3 license. See the LICENSE file in the project root for more information.

# Start Gunicorn
gunicorn --workers 1 --timeout 120 --log-level=debug -b :5000 app:app &

# Function to check if Gunicorn is ready
check_gunicorn() {
    python3 << END
import socket
import sys

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    sock.connect(("localhost", 5000))
except socket.error:
    sys.exit(1)
sock.close()
sys.exit(0)
END
}

# Wait for Gunicorn to be ready
until check_gunicorn; do
  echo "Waiting for Gunicorn..."
  sleep 0.1
done

# Start Nginx
nginx -g 'daemon off;'