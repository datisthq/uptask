# Agents

This file provides guidance to coding agents when working with code in this repository.

## General

- Prioritize using LSP capabilities if possible
- When resolving a TODO, follow its instructions literally
- Run type checking as part of your tasks
- Run specs as part of your tasks
- Run linting as part of your tasks
- Start plan from a summary a API summary (models/signatures) and most challenging points, continue plan using your default settings

## Commands

- Run `pnpm install` to install all dependencies

## Python

Working directory: `python`

### Commands

- Run `uv run task lint` to lint the code using Ruff
- Run `uv run task format` to auto-fix formatting issues with Ruff
- Run `uv run task type` to run type checking
- Run `uv run task spec` to run only the pytest tests
- Run `uv run pytest path/to/test.py` to run a single test file

### Formats

- Use 4-space indentation, UTF-8 encoding, and LF line endings
- Use PascalCase for classes, snake_case for functions, methods, and variables
- Place high-level public items first in a file and low-level private items last

### Types

- Use Python type hints; target Python 3.12+
- Never use `Any` without permission

### Specs

- Place unit tests in `<module>_spec.py` files and don't add useless comments like "Arrange", "Act", "Assert"

### Docs

- Add docstrings only for public APIs and don't use them for files
- Don't write `#` comments in the code

## Typescript

Working directory: `typescript`

## Commands

- Run `pnpm lint` to lint the code using Biome
- Run `pnpm format` to auto-fix formatting issues with Biome
- Run `pnpm type` to check TypeScript types
- Run `pnpm spec` to run only the Vitest tests
- Run `pnpm exec vitest run path/to/test.ts` to run a single test

## Formats

- Use 2-space indentation, UTF-8 encoding, and LF line endings
- Use PascalCase for classes and interfaces, and camelCase for methods and variables
- Place high-level public items first in a file and low-level private items last
- Use ES modules with full import paths including the ".ts(x)" file extension

## Types

- Use strict TypeScript with null checks but don't add explicit return types to functions
- Never use TypeScript `any`, type casting `as`, or `!` without permission

## Specs

- Place unit tests in `<module>.spec.ts` files and don't add useless comments like "Arrange", "Act", "Assert"

## Docs

- Add Typedoc comments only for public APIs and don't add them for files or use @params directives
- Don't write `//` comments in the code
