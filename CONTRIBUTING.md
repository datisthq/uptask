# Contributing to UpTask

Thank you for your interest in contributing to UpTask! This document provides guidelines and instructions for contributing to this project.

## Project Overview

UpTask is a modular task management library organized as a monorepo with the following packages:

- `@uptask/core`: Core functionality with task management and utilities
- `@uptask/cli`: Command-line interface for running tasks
- `@uptask/cron`: Cron scheduling functionality for tasks
- `uptask`: Meta-package that re-exports all functionality from core, CLI, and cron

## Development Environment

### Prerequisites

- **Node.js**: v22.0.0 or higher
- **PNPM**: v10.0.0 or higher

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/uptask.git
   cd uptask
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Initialize git hooks
   ```bash
   pnpm run init
   ```

### Monorepo Commands

- Work on a specific package:
  ```bash
  pnpm core <command>    # Core package commands
  pnpm cli <command>     # CLI package commands
  pnpm cron <command>    # Cron package commands
  pnpm uptask <command>  # Meta package commands
  ```

## Development Workflow

### Code Style and Quality

We use Biome for linting and formatting, and TypeScript for type checking:

- **Lint**: Check for code issues
  ```bash
  pnpm run lint
  ```

- **Format**: Auto-fix formatting issues
  ```bash
  pnpm run format
  ```

- **Type Check**: Verify TypeScript types
  ```bash
  pnpm run type
  ```

- **Comprehensive Check**: Run lint and type checking
  ```bash
  pnpm run check
  ```

### Testing

Tests are located in `__spec__` directories and use Vitest:

- **Run All Tests**: (includes linting and type checking)
  ```bash
  pnpm test
  ```

- **Run Tests Only**: (without linting/type checking)
  ```bash
  pnpm run spec
  ```

- **Run a Specific Test**:
  ```bash
  pnpm exec vitest run core/actions/__spec__/findTask.ts
  ```

### Dependencies

Update all dependencies to their latest versions:

```bash
pnpm run bump
```

## Project Structure

- `core/`: Base functionality
  - `actions/`: Core utility functions
  - `models/`: Core data structures
- `cli/`: Command-line interface
- `cron/`: Scheduling functionality
- `uptask/`: Meta-package that re-exports from other packages
- `__spec__/`: Test files (found within each package)

## Code Style Guidelines

- Use TypeScript with strict type checking
- Follow ES modules pattern (`import`/`export`)
- Tests should be placed in `__spec__` directories
- Use semicolons as needed (not required everywhere)
- Use arrow function parentheses as needed (omitted for single parameters)

## Making Changes to the Meta-Package

When adding new functionality:

1. Add it to the appropriate package first (`core`, `cli`, or `cron`)
2. Ensure it's properly exported from that package
3. No additional work is needed for the meta-package as it automatically re-exports everything

## Submitting Changes

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Make your changes with appropriate tests
3. Ensure the code passes all checks: `pnpm test`
4. Commit your changes with a descriptive message
5. Submit a pull request

## License

By contributing to UpTask, you agree that your contributions will be licensed under the project's license.

Thank you for your contribution!
