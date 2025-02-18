# PEST.js - Progressive Express Starter Template

<div align="center">
  <img src="/pestjs-logo.png" alt="PEST.js Logo" width="200" height="200"/>
  
  <p><strong>Progressive • Elegant • Structured • TypeScript</strong></p>
</div>

## The Progressive Node.js Template Engine

PEST.js is an advanced template engine that generates production-ready Node.js applications with enterprise-grade architecture and modern development practices. It focuses on progressive enhancement, allowing your application to grow seamlessly from a simple API to a full-scale enterprise system.

## Core Features

- 🏗️ **Progressive Architecture**: Scale from simple to complex without restructuring
- 🔒 **Enterprise Security**: Industry-standard security practices built-in
- 📦 **Intelligent Defaults**: Smart configurations that adapt to your needs
- 🔍 **TypeScript-First**: Built for type safety and modern development
- 🧪 **Testing Framework**: Comprehensive testing suite included
- 📚 **Self-Documenting**: Automated API documentation generation
- 🐳 **Container-Ready**: Containerization support from day one
- 📝 **Observable**: Logging and monitoring built-in

## Why PEST.js?

- 🚀 **Start Small, Grow Big**: Perfect for both MVPs and enterprise applications
- 🎯 **Production-First**: No need to restructure for production
- 📦 **Zero-Config**: Works out of the box with smart defaults
- 🔒 **Type-Safe**: Catch errors before they happen
- 🏗️ **Feature-Based**: Organized for maintainability
- 🧪 **Test-Driven**: Testing infrastructure ready to go
- 📚 **Well Documented**: Clear, automated documentation
- 🐳 **Cloud-Native**: Ready for modern deployment

## Overview

This script creates a complete project structure with all necessary configuration files for a modern Node.js application. It sets up a feature-based architecture that follows best practices and includes essential tools and configurations.

## Features

- 🚀 Automated project scaffolding
- 📁 Feature-based folder structure
- ⚙️ Pre-configured TypeScript setup
- 🔒 Environment configuration with validation
- 🗃️ MongoDB/Mongoose integration
- 🔑 Authentication boilerplate
- 📝 Logging setup
- 🧪 Testing infrastructure
- 🐳 Docker configuration
- 💅 Code formatting and linting setup

## Prerequisites

- Bash shell
- Basic command line knowledge

Here's the updated version of your instructions in a clean, professional format for a repository README:

---

## Usage

### 1. Download the Setup Script

#### **Windows (PowerShell)**
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/nabinkhair42/mern-stater-kit/main/setup.sh" -OutFile "setup.sh"
```
Or, if `curl` is installed:
```powershell
curl.exe -O https://raw.githubusercontent.com/nabinkhair42/mern-stater-kit/main/setup.sh
```

#### **macOS & Linux (Terminal)**
```bash
curl -O https://raw.githubusercontent.com/nabinkhair42/mern-stater-kit/main/setup.sh
```

### 2. Make the Script Executable

#### **macOS & Linux**
```bash
chmod +x setup.sh
```

#### **Windows (Git Bash, WSL, or PowerShell with Ubuntu Subsystem)**
```bash
chmod +x setup.sh
```
*(PowerShell does not require this step.)*

### 3. Run the Script

#### **macOS & Linux**
```bash
./setup.sh
```

#### **Windows (PowerShell)**
```powershell
bash setup.sh
```
*(Requires WSL, Git Bash, or a compatible shell.)*

### 4. Enter the Project Name

When prompted, enter your project name or press **Enter** to use the default name.

---

## Generated Structure

The script creates the following structure:

```
project-root/
├───docs
│   └───api
├───scripts
├───src
│   ├───config
│   ├───features
│   │   ├───auth
│   │   │   ├───controllers
│   │   │   ├───models
│   │   │   ├───routes
│   │   │   ├───schemas
│   │   │   └───services
│   │   └───users
│   │       ├───controllers
│   │       ├───models
│   │       ├───routes
│   │       ├───schemas
│   │       └───services
│   ├───middleware
│   ├───types
│   └───utils
└───tests
    ├───fixtures
    ├───integration
    └───unit
```

## Generated Files

The script creates and configures the following files:

### Core Configuration
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env`, `.env.example`, `.env.test` - Environment configurations
- `Dockerfile` and `docker-compose.yml` - Docker setup

### Development Tools
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.gitignore` - Git ignore rules
- `jest.config.js` - Jest testing configuration

### Application Files
- `src/app.ts` - Application entry point
- `src/config/` - Configuration files for database, environment, etc.
- Feature modules with MVC structure
- Utility scripts for database seeding and documentation generation

## Post-Setup Steps

After running the script:

1. Navigate to your project directory:
   ```bash
   cd your-project-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your configuration

4. Start development:
   ```bash
   npm run dev
   ```

## Available Scripts

The generated project includes several npm scripts:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm test` - Run tests
- `npm run seed` - Run database seeding
- `npm run docs` - Generate API documentation

## Contributing

Feel free to submit issues and enhancement requests to our [GitHub repository](https://github.com/nabinkhair42/pest.js)!
