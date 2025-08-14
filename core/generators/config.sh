#!/bin/bash

# Config Generator
# Generates essential configuration files

generate_tsconfig() {
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

generate_eslint() {
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

generate_gitignore() {
  cat > .gitignore << 'EOF'
node_modules/
dist/
.env
*.log
coverage/
.DS_Store
EOF
}

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

generate_jest_config() {
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

generate_prettier_ignore() {
  cat > .prettierignore << 'EOF'
node_modules/
dist/
coverage/
EOF
}

generate_husky_config() {
  mkdir -p .husky
  cat > .husky/pre-commit << 'EOF'
npx lint-staged
EOF
}

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