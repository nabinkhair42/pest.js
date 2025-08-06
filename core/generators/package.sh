#!/bin/bash

# Package.json Generator
# Generates minimal, focused package.json

generate_package_json() {
  local project_name="$1"
  local github_username="$2"
  
  cat > package.json << EOF
{
  "name": "$project_name",
  "version": "1.0.0",
  "description": "PEST.js application",
  "main": "dist/app.js",
  "author": "$github_username",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.5",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.3",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1"
  }
}
EOF
} 