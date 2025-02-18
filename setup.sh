#!/bin/bash

# Script to create a feature-based folder structure for a Node.js, TypeScript, Express, and Mongoose project

# Set colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create directories and echo output
create_dir() {
  mkdir -p "$1"
  echo -e "${GREEN}Created directory:${NC} $1"
}

# Function to create files with content
create_file() {
  local file_path="$1"
  local content="$2"
  
  # Create directory if it doesn't exist
  local dir=$(dirname "$file_path")
  mkdir -p "$dir"
  
  # Create file with content
  echo "$content" > "$file_path"
  echo -e "${BLUE}Created file:${NC} $file_path"
}

# Ask for project name
read -p "Enter project name (default: nodejs-ts-express-mongoose-boilerplate): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-nodejs-ts-express-mongoose-boilerplate}

# Create root directory
create_dir "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create main structure
create_dir "src"
create_dir "src/config"
create_dir "src/features"
create_dir "src/middleware"
create_dir "src/utils"
create_dir "src/types"
create_dir "tests/unit"
create_dir "tests/integration"
create_dir "tests/fixtures"
create_dir "scripts"
create_dir "docs/api"

# Create feature structure with example features
FEATURES=("auth" "users")

for feature in "${FEATURES[@]}"; do
  create_dir "src/features/$feature/controllers"
  create_dir "src/features/$feature/models"
  create_dir "src/features/$feature/routes"
  create_dir "src/features/$feature/services"
  create_dir "src/features/$feature/schemas"
  
  # Create index.ts for each feature
  create_file "src/features/$feature/index.ts" "// Export feature components\n\n// Export controllers\n// Export models\n// Export routes\n// Export services"
done

# Create core files
create_file "src/app.ts" "import express from 'express';
import { createApp } from './config/app';
import { connectToDatabase } from './config/database';
import { env } from './config/env';
import logger from './utils/logger';

// Import feature routes
// import authRoutes from './features/auth/routes';
// import userRoutes from './features/users/routes';

async function bootstrap() {
  const app = createApp();
  
  // Register routes
  // app.use('/api/auth', authRoutes);
  // app.use('/api/users', userRoutes);
  
  // Connect to database
  await connectToDatabase();
  
  // Start server
  const server = app.listen(env.PORT, () => {
    logger.info(\`Server running at http://localhost:\${env.PORT}\`);
  });
  
  // Handle shutdown gracefully
  const shutdown = async () => {
    logger.info('Shutting down server...');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
"

# Create config files
create_file "src/config/env.ts" "import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('7d'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
  LOGS_DIRECTORY: z.string().default('logs'),
});

// Validate environment variables
try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:', JSON.stringify(error.format(), null, 2));
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10),
  LOGS_DIRECTORY: process.env.LOGS_DIRECTORY,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};"

create_file "src/config/database.ts" "import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

// Configure mongoose
mongoose.set('strictQuery', true);

// Connect to MongoDB
export const connectToDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    logger.info(\`Successfully connected to MongoDB: \${connection.connection.name}\`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Disconnect from MongoDB
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Successfully disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.info('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});"

# Create environment files
create_file ".env.example" "NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOGS_DIRECTORY=logs"

create_file ".env" "NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOGS_DIRECTORY=logs"

create_file ".env.test" "NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/your_database_test
JWT_SECRET=test_jwt_secret
JWT_EXPIRATION=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOGS_DIRECTORY=logs"

# Create configuration files
create_file "package.json" '{
  "name": "'$PROJECT_NAME'",
  "version": "1.0.0",
  "description": "A feature-based Node.js, TypeScript, Mongoose, Express.js boilerplate",
  "main": "dist/app.js",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "seed": "ts-node scripts/seed-db.ts",
    "docs": "ts-node scripts/generate-docs.ts",
    "prepare": "husky install"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "http-status": "^1.7.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.1.1",
    "morgan": "^1.10.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.11.5",
    "@types/supertest": "^6.0.2",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "husky": "^8.0.3",
    "jest": "^29.7.0",
    "lint-staged": "^15.2.0",
    "nodemon": "^3.0.3",
    "prettier": "^3.2.4",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}'

create_file "tsconfig.json" '{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "sourceMap": true,
    "declaration": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/types"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}'

create_file ".gitignore" "# Dependency directories
node_modules/
dist/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
.env.test.local

# Coverage directory
coverage/

# IDE directories
.idea/
.vscode/
*.sublime-workspace

# OS files
.DS_Store
Thumbs.db

# Debug files
.node-inspect

# Build directory
build/

# TypeScript build info
*.tsbuildinfo"

create_file ".eslintrc.js" "module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
  },
  env: {
    node: true,
    jest: true,
  },
};"

create_file ".prettierrc" '{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}'

create_file "jest.config.js" "module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
};"

create_file "tests/setup.ts" "import { connectToDatabase, disconnectFromDatabase } from '../src/config/database';

// Setup before all tests
beforeAll(async () => {
  await connectToDatabase();
});

// Cleanup after all tests
afterAll(async () => {
  await disconnectFromDatabase();
});"

# Create Docker files
create_file "Dockerfile" "FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [\"node\", \"dist/app.js\"]"

create_file "docker-compose.yml" "version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/your_database
      - JWT_SECRET=your_production_jwt_secret
    depends_on:
      - mongodb
    restart: unless-stopped
    networks:
      - app-network

  mongodb:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
    driver: local"

# Create utility scripts
create_file "scripts/seed-db.ts" "import mongoose from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../src/config/database';
import logger from '../src/utils/logger';

// Import models
// import { User } from '../src/features/auth/models/user.model';

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    logger.info('Connected to database for seeding');

    // Clear existing data (optional)
    // await User.deleteMany({});
    // logger.info('Cleared existing users');

    // Example: Create admin user
    // await User.create({
    //   name: 'Admin User',
    //   email: 'admin@example.com',
    //   password: 'SecurePassword123!',
    //   role: 'admin',
    // });
    // logger.info('Admin user created');

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
  }
};

seedDatabase();"

create_file "scripts/generate-docs.ts" "import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { version } from '../package.json';
import logger from '../src/utils/logger';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version,
      description: 'API documentation for the Node.js TypeScript Express Mongoose boilerplate',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/features/**/routes/*.ts', './src/features/**/schemas/*.ts'],
};

const generateDocs = async () => {
  try {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    
    // Create docs directory if it doesn't exist
    const docsDir = path.join(process.cwd(), 'docs', 'api');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Write swagger.json file
    fs.writeFileSync(
      path.join(docsDir, 'swagger.json'),
      JSON.stringify(swaggerSpec, null, 2)
    );
    
    logger.info('API documentation generated successfully at docs/api/swagger.json');
  } catch (error) {
    logger.error('Error generating API documentation:', error);
    process.exit(1);
  }
};

generateDocs();"

# Create types directory files
create_file "src/types/environment.d.ts" "declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX: string;
    LOGS_DIRECTORY: string;
  }
}"

create_file "src/types/express.d.ts" "import { JwtPayload } from '../middleware/auth-middleware';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}"

# Create README file
create_file "README.md" "# $PROJECT_NAME

A feature-based Node.js, TypeScript, Mongoose, Express.js boilerplate with industry-standard tools and practices.

## Features

- TypeScript configuration with strict type checking
- Express.js with proper middleware setup
- MongoDB integration with Mongoose
- Feature-based folder structure for better organization
- Authentication with JWT
- Role-based authorization
- Request validation with Zod
- Environment variables validation
- Error handling middleware
- Logging with Winston
- API documentation with Swagger/OpenAPI
- Unit and integration testing setup with Jest
- Linting with ESLint and Prettier
- Docker and Docker Compose configuration
- CI/CD pipelines (example provided)
- Database seeding scripts

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- MongoDB (local instance or Atlas)

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/$PROJECT_NAME.git
   cd $PROJECT_NAME
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Configure environment variables:
   \`\`\`
   cp .env.example .env
   \`\`\`
   Update the values in .env with your configuration.

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

### Building for Production

\`\`\`
npm run build
npm start
\`\`\`

### Docker Setup

\`\`\`
docker-compose up -d
\`\`\`

## Project Structure

\`\`\`
project-root/
│
├── src/                          # Source files
│   ├── config/                   # Configuration files
│   ├── features/                 # Feature-based organization
│   │   ├── auth/                 # Authentication feature
│   │   ├── users/                # Users feature
│   │   └── [other-features]/     # Other features
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Utility functions and helpers
│   ├── types/                    # TypeScript type definitions
│   └── app.ts                    # Application entry point
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── setup.ts                  # Test setup
│
├── scripts/                      # Utility scripts
├── docs/                         # Documentation
├── [configuration files]         # Various config files (.env, etc.)
\`\`\`

## Available Scripts

- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm start\`: Start production server
- \`npm run lint\`: Lint code
- \`npm run format\`: Format code
- \`npm test\`: Run tests
- \`npm run test:watch\`: Run tests in watch mode
- \`npm run test:coverage\`: Run tests with coverage report
- \`npm run seed\`: Seed database
- \`npm run docs\`: Generate API documentation

## API Documentation

API documentation is available at \`http://localhost:3000/api-docs\` when the server is running.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
"

# Create CHANGELOG file
create_file "CHANGELOG.md" "# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - $(date +'%Y-%m-%d')

### Added
- Initial project structure
- Express.js setup with TypeScript
- Mongoose integration
- Authentication with JWT
- Request validation with Zod
- Error handling middleware
- Logging with Winston
- API documentation with Swagger
- Testing setup with Jest
- Docker configuration
"

echo -e "\n${GREEN}Project structure for $PROJECT_NAME created successfully!${NC}"
echo -e "To get started:
  1. cd $PROJECT_NAME
  2. npm install
  3. Update the .env file with your configuration
  4. npm run dev"