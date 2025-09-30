#!/bin/bash

# Backend settings
export BACKEND_PATH="$GOPATH/src/github.com/sanjeevmurmu/logana/backend"
export BACKEND_PORT=8080

# Frontend settings
export FRONTEND_PATH="$PWD/frontend"
export FRONTEND_PORT=3000

# Elasticsearch settings
export ES_HOST="localhost"
export ES_PORT=9200

# Check if backend exists
if [ ! -d "$BACKEND_PATH" ]; then
    echo "Error: Backend not found at $BACKEND_PATH"
    echo "Please make sure your Go backend is properly set up in your Go workspace"
    exit 1
fi

# Check if frontend exists
if [ ! -d "$FRONTEND_PATH" ]; then
    echo "Error: Frontend not found at $FRONTEND_PATH"
    echo "Please make sure you are in the correct directory"
    exit 1
fi 