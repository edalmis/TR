#!/bin/bash

# Read the FRONTEND_PORT value from .env
FRONTEND_PORT=$(grep '^FRONTEND_PORT=' ../../.env | cut -d'=' -f2)

# Update the Dockerfile with the exposed port
sed -i "s/EXPOSE [0-9]*/EXPOSE $FRONTEND_PORT/" Dockerfile
