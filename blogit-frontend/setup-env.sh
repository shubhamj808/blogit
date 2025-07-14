#!/bin/bash

# Create .env file
cat > .env << EOL
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=5000
VITE_INTERACTION_SERVICE_PATH=/api/v1/interactions
VITE_POST_SERVICE_PATH=/api/posts
VITE_USER_SERVICE_PATH=/api/v1/users
EOL

echo "Created .env file with default values" 