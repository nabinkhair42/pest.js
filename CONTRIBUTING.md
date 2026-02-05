# Contributing to PEST.js

We welcome contributions! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

- Use the GitHub issue tracker to report bugs
- Provide detailed steps to reproduce the issue
- Include your environment details (OS, Node.js version, etc.)
- Describe expected vs actual behavior

### Submitting Changes

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Add tests for new functionality
5. Update documentation if needed
6. Ensure all tests pass
7. Submit a pull request

### Code Standards

- Follow the existing code style
- Write clear, descriptive commit messages following conventional commits
- Add tests for new features
- Update documentation for API changes
- Ensure your code passes linting and type checking

## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build the CLI: `pnpm --filter pest-js-app build`
4. Run tests: `pnpm --filter pest-js-app test`
5. Test locally: `node packages/cli/dist/index.js`

## Project Structure

- `packages/cli/` - The CLI package (published as `pest-js-app`)
- `www/` - Documentation website

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter pest-js-app build` | Build the CLI |
| `pnpm --filter pest-js-app test` | Run unit tests |
| `pnpm --filter pest-js-app typecheck` | Run type checking |
| `pnpm --filter pest-js-app dev` | Build with watch mode |

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
