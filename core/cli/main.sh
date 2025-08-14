#!/bin/bash
# PEST.js - Minimal CLI
# Progressive Express Starter Template
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Print functions
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Banner
show_banner() {
  echo
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║                    PEST.js Framework v2.0.0                    ║"
  echo "║              Progressive Express Starter Template            ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo
}

# Validate environment
validate_env() {
  print_info "Validating environment..."
  if ! command -v node &> /dev/null; then
    print_error "Node.js is required"
    exit 1
  fi
  if ! command -v npm &> /dev/null; then
    print_error "npm is required"
    exit 1
  fi
  print_success "Environment validated"
}

# Get project details
get_project_details() {
  print_info "Collecting project details..."
  read -p "Project name (default: pestjs-app): " PROJECT_NAME
  PROJECT_NAME=${PROJECT_NAME:-pestjs-app}
  read -p "GitHub username (default: your-username): " GITHUB_USERNAME
  GITHUB_USERNAME=${GITHUB_USERNAME:-your-username}
  read -p "Project description (default: PEST.js application): " PROJECT_DESCRIPTION
  PROJECT_DESCRIPTION=${PROJECT_DESCRIPTION:-PEST.js application}
  print_success "Project details collected"
}

# Create project structure
create_structure() {
  print_info "Creating project structure..."
  mkdir -p "$PROJECT_NAME"
  cd "$PROJECT_NAME"
  mkdir -p src/{config,features,middleware,utils,types}
  mkdir -p tests/{unit,integration}
  mkdir -p scripts docs
  mkdir -p src/features/{auth,users}/{controllers,models,routes,services,schemas}
  print_success "Project structure created"
}

# Generate essential files
generate_files() {
  print_info "Generating project files..."
  generate_package_json "$PROJECT_NAME" "$PROJECT_DESCRIPTION" "$GITHUB_USERNAME"
  generate_tsconfig
  generate_eslint
  generate_gitignore
  generate_jest_config
  generate_vercel_json
  generate_prettier_config
  generate_prettier_ignore
  generate_husky_config
  generate_app_file "$PROJECT_NAME"
  generate_test_file
  generate_env_files
  print_success "Project files generated"
}

# Generate package.json
generate_package_json() {
  cat > package.json << 'EOF'
{
  "name": "PROJECT_NAME",
  "version": "1.0.0",
  "description": "PROJECT_DESCRIPTION",
  "main": "dist/app.js",
  "author": "GITHUB_USERNAME",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "prepare": "husky install"
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
    "prettier": "^3.6.2",
    "husky": "^9.1.7",
    "lint-staged": "^15.2.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.2",
    "ts-jest": "^29.1.0",
    "nodemon": "^3.0.3",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1"
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
EOF

  # Replace placeholders
  sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" package.json
  sed -i "s/PROJECT_DESCRIPTION/$PROJECT_DESCRIPTION/g" package.json
  sed -i "s/GITHUB_USERNAME/$GITHUB_USERNAME/g" package.json
}

# Generate config files
generate_tsconfig() {
  # TypeScript config
  cat > tsconfig.json << 'EOF'
{
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
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF
}

# Generate ESLint config
generate_eslint() {
  # ESLint config
  cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
EOF
}

# Generate Gitignore
generate_gitignore() {
  # Gitignore
  cat > .gitignore << 'EOF'
node_modules/
dist/
.env
*.log
coverage/
.DS_Store
EOF
}



# Generate Jest config
generate_jest_config() {
  # Jest config
  cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
};
EOF
}

# Generate vercel.json file in root:
generate_vercel_json() {
  cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.ts",
      "use": "@vercel/node",
      "config": {
        "maxDuration": 60,
        "memory": 1024
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.ts",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      }
    }
  ]
}
EOF
}

# Generate prettier config
generate_prettier_config() {
  cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF
}

# Generate prettier ignore
generate_prettier_ignore() {
  cat > .prettierignore << 'EOF'
node_modules/
dist/
coverage/
EOF
}

# Generate husky config
generate_husky_config() {
  mkdir -p .husky
  cat > .husky/pre-commit << 'EOF'
npx lint-staged
EOF
}


# Generate app file
generate_app_file() {
  cat > src/app.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => {
  res.json({
    message: 'Welcome to PROJECT_NAME API',
    version: '1.0.0'
  });
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
EOF

  sed -i "s/PROJECT_NAME/$PROJECT_NAME/g" src/app.ts
}

# Generate environment files
generate_env_files() {
  cat > .env.example << 'EOF'
NODE_ENV=development
PORT=3000
EOF

  cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
EOF
}

# Initialize git
init_git() {
  print_info "Initializing git repository..."
  
  # Set git config before init
  git config --global user.email "pestjs@example.com" || true
  git config --global user.name "PEST.js CLI" || true
  
  # Initialize git repository
  git init
  
  # Add all files
  git add .
  
  # Commit with proper identity
  git commit -m "Initial commit: PEST.js project" || {
    print_error "Failed to commit. Trying with local config..."
    git config user.email "pestjs@example.com"
    git config user.name "PEST.js CLI"
    git commit -m "Initial commit: PEST.js project"
  }
  
  print_success "Git repository initialized"
}

# Show next steps
show_next_steps() {
  print_success "Project '$PROJECT_NAME' created successfully!"
  echo
  print_info "Next steps:"
  echo "1. cd $PROJECT_NAME"
  echo "2. npm install"
  echo "3. npm run dev"
  echo "4. npm run lint"
  echo "5. npm run lint:fix"
  echo "6. npm run format"
  echo "7. npm run format:check"
  echo "8. npm run test"
  echo "9. npm run prepare"
  echo "10. npm run build"
  echo
  print_info "Happy coding! 🚀"
}

# Main function
main() {
  show_banner
  validate_env
  get_project_details
  create_structure
  generate_files
  init_git
  show_next_steps
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi 