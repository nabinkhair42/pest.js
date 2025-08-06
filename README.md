# PEST.js - Progressive Express Starter Template

<div align="center">
  <img src="/assets/pestjs-logo.png" alt="PEST.js Logo" width="200" height="200"/>
  
  <p><strong>Progressive • Elegant • Structured • TypeScript</strong></p>
</div>

## Overview

PEST.js is a **minimal, scalable framework** that generates production-ready Node.js applications. It focuses on **essential functionality** and **developer experience**, providing a clean foundation that grows with your project.

## Features

- **Minimal Dependencies**: Only essential packages included
- **TypeScript-First**: Built for modern development
- **Clean Architecture**: Feature-based organization
- **Testing Ready**: Jest configuration included
- **Linting Setup**: ESLint with TypeScript support
- **Git Integration**: Automatic repository initialization

## Quick Start

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nabinkhair42/pest.js.git
   cd pest.js
   ```

2. **Run the framework**
   ```bash
   ./pestjs
   ```

3. **Follow the prompts**
   - Enter project name
   - Enter GitHub username

### Post-Setup Steps

1. Navigate to your project directory:
   ```bash
   cd your-project-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Project Structure

```
pest.js/
├── core/                    # Framework core
│   ├── cli/                # CLI interface
│   │   └── main.sh         # Main CLI logic
│   ├── generators/          # Code generators
│   │   ├── package.sh      # Package.json generator
│   │   ├── config.sh       # Config files generator
│   │   └── app.sh          # App file generator
│   ├── utils/              # Utilities
│   │   └── helpers.sh      # Helper functions
│   └── templates/          # Project templates
├── www/                    # Documentation site
├── public/                 # Static assets
├── scripts/                # Build scripts
├── docs/                   # Framework docs
└── pestjs                  # CLI entry point
```

## Generated Project Structure

```
your-project/
├── src/
│   ├── config/            # Configuration
│   ├── features/          # Feature modules
│   │   ├── auth/
│   │   └── users/
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
├── tests/
│   ├── unit/
│   └── integration/
├── scripts/              # Utility scripts
├── docs/                 # Documentation
└── [config files]
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Framework Architecture

### Core Components

1. **CLI Entry Point** (`pestjs`)
   - Minimal, focused interface
   - Essential project setup

2. **Modular Generators** (`core/generators/`)
   - `package.sh` - Package.json generation
   - `config.sh` - Configuration files
   - `app.sh` - Application setup

3. **Utilities** (`core/utils/`)
   - `helpers.sh` - Essential helper functions
   - Validation and file operations

### Design Principles

- **Minimal Dependencies**: Only essential packages
- **Modular Structure**: Focused, single-purpose files
- **Developer Experience**: Clean, intuitive interface
- **Scalable Foundation**: Easy to extend and customize

## Dependencies

### Core Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `dotenv` - Environment variables

### Development Dependencies
- `typescript` - Type safety
- `jest` - Testing framework
- `eslint` - Code linting
- `nodemon` - Development server

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
