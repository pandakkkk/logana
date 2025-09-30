#!/bin/bash

# Function to stop all processes on script exit
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load configuration
if [ -f "./config.sh" ]; then
    source ./config.sh
else
    echo -e "${RED}Error: config.sh not found${NC}"
    exit 1
fi

echo -e "${BLUE}Starting Logana Application...${NC}"

# Check Elasticsearch
echo -e "Checking Elasticsearch connection..."
if curl -s "http://${ES_HOST}:${ES_PORT}" > /dev/null; then
    echo -e "${GREEN}Elasticsearch is running${NC}"
else
    echo -e "${RED}Error: Cannot connect to Elasticsearch at http://${ES_HOST}:${ES_PORT}${NC}"
    echo "Please make sure Elasticsearch is running"
    exit 1
fi

# Start backend
echo -e "${GREEN}Starting Go backend from $BACKEND_PATH...${NC}"
cd "$BACKEND_PATH"
go run main.go &
BACKEND_PID=$!

# Wait for backend to start and check if it's running
echo "Waiting for backend to start..."
sleep 3
if ! curl -s "http://localhost:${BACKEND_PORT}/health" > /dev/null; then
    echo -e "${RED}Error: Backend failed to start${NC}"
    cleanup
fi
echo -e "${GREEN}Backend is running${NC}"

# Start frontend
echo -e "${GREEN}Starting React frontend...${NC}"
cd "$FRONTEND_PATH"
npm start &
FRONTEND_PID=$!

# Print access URLs
echo -e "\n${BLUE}Access URLs:${NC}"
echo -e "Frontend: ${GREEN}http://localhost:${FRONTEND_PORT}${NC}"
echo -e "Backend API: ${GREEN}http://localhost:${BACKEND_PORT}${NC}"
echo -e "Elasticsearch: ${GREEN}http://${ES_HOST}:${ES_PORT}${NC}\n"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 