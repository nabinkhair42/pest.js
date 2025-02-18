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

# Add GitHub username prompt
read -p "Enter your GitHub username: " GITHUB_USERNAME
GITHUB_USERNAME=${GITHUB_USERNAME:-example-user}

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
create_file "src/app.ts" "import { createApp } from './config/app';
import { connectToDatabase } from './config/database';
import { env } from './config/env';
import logger from './utils/logger';

async function bootstrap() {
  const app = createApp();
  
  // Add root route
  app.get('/', (_, res) => {
    res.json({
      message: 'Welcome to ${PROJECT_NAME} API',
      version: '1.0.0',
      docs: '/api-docs'
    });
  });
  
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
});"

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
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', JSON.stringify(error.format(), null, 2));
      process.exit(1);
    }
    throw error;
  }
};

const validatedEnv = validateEnv();

export const env = {
  NODE_ENV: validatedEnv.NODE_ENV,
  PORT: parseInt(validatedEnv.PORT, 10),
  MONGODB_URI: validatedEnv.MONGODB_URI,
  JWT_SECRET: validatedEnv.JWT_SECRET,
  JWT_EXPIRATION: validatedEnv.JWT_EXPIRATION,
  RATE_LIMIT_WINDOW_MS: parseInt(validatedEnv.RATE_LIMIT_WINDOW_MS, 10),
  RATE_LIMIT_MAX: parseInt(validatedEnv.RATE_LIMIT_MAX, 10),
  LOGS_DIRECTORY: validatedEnv.LOGS_DIRECTORY,
  IS_PRODUCTION: validatedEnv.NODE_ENV === 'production',
  IS_TEST: validatedEnv.NODE_ENV === 'test',
  IS_DEVELOPMENT: validatedEnv.NODE_ENV === 'development',
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
  "author": "'$GITHUB_USERNAME'",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/'$GITHUB_USERNAME'/'$PROJECT_NAME'.git"
  },
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
    "docs": "ts-node scripts/generate-docs.ts"
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
    "jest": "^29.7.0",
    "nodemon": "^3.0.3",
    "prettier": "^3.2.4",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.2",
    "typescript": "~4.9.5"
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

# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create utility scripts
create_file "scripts/seed-db.ts" "import { connectToDatabase, disconnectFromDatabase } from '../src/config/database';
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

interface SwaggerServer {
  url: string;
  description: string;
}

interface SwaggerParameter {
  name: string;
  in: string;
  description?: string;
}

interface SwaggerMethodDetails {
  summary?: string;
  description?: string;
  parameters?: SwaggerParameter[];
  requestBody?: {
    content: {
      'application/json': {
        schema: unknown;
      };
    };
  };
  responses: Record<string, { description: string }>;
}

interface SwaggerPaths {
  [path: string]: {
    [method: string]: SwaggerMethodDetails;
  };
}

interface SwaggerSpec {
  info: {
    description: string;
  };
  servers: SwaggerServer[];
  paths: SwaggerPaths;
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version,
      description: 'API documentation for the Node.js TypeScript Express Mongoose boilerplate',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
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
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
    ],
  },
  apis: [
    './src/features/**/routes/*.ts',
    './src/features/**/schemas/*.ts',
    './src/features/**/controllers/*.ts',
  ],
};

const generateDocs = async () => {
  try {
    logger.info('Generating API documentation...');
    const swaggerSpec = swaggerJsdoc(swaggerOptions) as SwaggerSpec;
    
    // Create docs directory if it doesn't exist
    const docsDir = path.join(process.cwd(), 'docs', 'api');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Write swagger.json file
    const swaggerPath = path.join(docsDir, 'swagger.json');
    fs.writeFileSync(swaggerPath, JSON.stringify(swaggerSpec, null, 2));
    
    // Generate markdown documentation (optional)
    const markdownContent = generateMarkdownDocs(swaggerSpec);
    fs.writeFileSync(path.join(docsDir, 'api.md'), markdownContent);
    
    logger.info(\`API documentation generated successfully:
    - Swagger JSON: docs/api/swagger.json
    - Markdown: docs/api/api.md\`);
  } catch (error) {
    logger.error('Error generating API documentation:', error);
    process.exit(1);
  }
};

const generateMarkdownDocs = (swagger: SwaggerSpec): string => {
  let markdown = \`# API Documentation
Generated on: \${new Date().toISOString()}

## Overview
\${swagger.info.description}

## Base URLs
\${swagger.servers.map((server: SwaggerServer) => \`- \${server.description}: \${server.url}\`).join('\\n')}

## Authentication
This API uses Bearer token authentication. Include the JWT token in the Authorization header:
\\\`\\\`\\\`
Authorization: Bearer your-token-here
\\\`\\\`\\\`

## Endpoints\n\`;

  // Generate documentation for each path
  Object.entries(swagger.paths).forEach(([path, methods]) => {
    markdown += \`\\n### \${path}\\n\`;
    
    Object.entries(methods).forEach(([method, details]) => {
      markdown += \`
#### \${method.toUpperCase()}
\${details.summary || ''}

\${details.description || ''}

\${details.parameters ? \`**Parameters:**
\${details.parameters.map((param: SwaggerParameter) => 
  \`- \${param.name} (\${param.in}) - \${param.description || ''}\`
).join('\\n')}\` : ''}

\${details.requestBody ? \`**Request Body:**
\\\`\\\`\\\`json
\${JSON.stringify(details.requestBody.content['application/json'].schema, null, 2)}
\\\`\\\`\\\`\` : ''}

**Responses:**
\${Object.entries(details.responses).map(([code, response]) => 
  \`- \${code}: \${response.description || ''}\`
).join('\\n')}
\`;
    });
  });

  return markdown;
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

A feature-based Node.js, TypeScript, Mongoose, Express.js boilerplate created by [$GITHUB_USERNAME](https://github.com/$GITHUB_USERNAME).

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

### Quick Start with Docker

1. Start MongoDB:
   \`\`\`bash
   docker-compose up -d mongodb
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the application:
   \`\`\`bash
   npm run dev
   \`\`\`

### Alternative MongoDB Setup

If not using Docker, you can:

1. Install MongoDB locally:
   - Windows: [MongoDB Windows Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - macOS: \`brew install mongodb-community\`
   - Linux: [MongoDB Linux Installation Guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB service:
   - Windows: \`net start MongoDB\`
   - macOS: \`brew services start mongodb-community\`
   - Linux: \`sudo systemctl start mongod\`

## Project Structure

\`\`\`
project-root/
│
├── src/                          # Source files
│   ├── config/                   # Configuration files
│   │   ├── config/               # Configuration files
│   │   ├── features/             # Feature-based organization
│   │   │   ├── auth/             # Authentication feature
│   │   │   ├── users/            # Users feature
│   │   │   └── [other-features]/ # Other features
│   │   ├── middleware/           # Custom middleware
│   │   ├── utils/                # Utility functions and helpers
│   │   ├── types/                # TypeScript type definitions
│   │   └── app.ts                # Application entry point
│   │
│   ├── tests/                    # Test files
│   │   ├── unit/                 # Unit tests
│   │   ├── integration/          # Integration tests
│   │   └── setup.ts              # Test setup
│   │
│   ├── scripts/                  # Utility scripts
│   ├── docs/                     # Documentation
│   ├── [configuration files]     # Various config files (.env, etc.)
│   └── [configuration files]       # Various config files (.env, etc.)
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

The API documentation is generated using Swagger/OpenAPI. To use it:

1. Generate the documentation:
   \`\`\`bash
   npm run docs
   \`\`\`
   This will create a swagger.json file in docs/api directory.

2. To view the documentation in the browser:
   - Add the following to src/config/app.ts:

   \`\`\`typescript
   import swaggerUi from 'swagger-ui-express';
   import * as swaggerDocument from '../docs/api/swagger.json';

   // Add before error handling middleware
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   \`\`\`

3. Access the documentation at http://localhost:3000/api-docs

### Documenting APIs

To document your APIs, add JSDoc comments to your route handlers. Example:

\`\`\`typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', userController.getUsers);
\`\`\`

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

# After the config files section, add:

# Create app configuration
create_file "src/config/app.ts" "import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { env } from './env';
import { errorHandler } from '../middleware/error-handler';
import 'express-async-errors';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  });
  app.use(limiter);

  // Request parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Compression
  app.use(compression());
  
  // Logging
  if (!env.IS_TEST) {
    app.use(morgan('dev'));
  }

  // Root route
  app.get('/', (_, res) => {
    res.json({
      message: 'Welcome to API',
      version: '1.0.0',
      docs: '/api-docs'
    });
  });

  // Health check
  app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

  // API Documentation
  if (!env.IS_PRODUCTION) {
    try {
      const swaggerPath = path.join(__dirname, '../../docs/api/swagger.json');
      if (fs.existsSync(swaggerPath)) {
        const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      } else {
        console.warn('Swagger documentation not found. Run npm run docs to generate it.');
      }
    } catch (error) {
      console.warn('Error loading Swagger documentation:', error);
    }
  }

  // Error handling
  app.use(errorHandler);

  return app;
}"

# Create error handler middleware
create_file "src/middleware/error-handler.ts" "import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MongooseError } from 'mongoose';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(400).json({
      status: 'error',
      message: 'Database error',
      error: err.message,
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};"

# Create logger utility
create_file "src/utils/logger.ts" "import winston from 'winston';
import { env } from '../config/env';

const logger = winston.createLogger({
  level: env.IS_PRODUCTION ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({ 
      filename: \`\${env.LOGS_DIRECTORY}/error.log\`, 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: \`\${env.LOGS_DIRECTORY}/combined.log\` 
    }),
  ],
});

if (!env.IS_PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;"

# Create ESLint configuration
create_file ".eslintrc.json" '{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-var-requires": "off"
  },
  "overrides": [
    {
      "files": ["src/config/**/*.ts"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
}'

# Create Jest configuration
create_file "jest.config.js" "module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
}"

create_file "jest.setup.js" "jest.setTimeout(30000);"

# Create a sample test
create_file "src/__tests__/app.test.ts" "import request from 'supertest';
import { createApp } from '../config/app';

describe('App', () => {
  const app = createApp();

  it('should return welcome message on root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: expect.stringContaining('Welcome'),
      version: expect.any(String),
      docs: expect.stringContaining('/api-docs')
    });
  });

  it('should return health check status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});"

# Create Docker Compose file
create_file "docker-compose.yml" "version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=your_database

volumes:
  mongodb_data:"

echo -e "\n${GREEN}Project structure for $PROJECT_NAME created successfully!${NC}"
echo -e "To get started:
  1. cd $PROJECT_NAME
  2. npm install
  3. Update the .env file with your configuration
  4. npm run dev"