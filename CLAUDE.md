# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Lint:** `pnpm run lint` (Biome for linting)
- **Format:** `pnpm run format` (Biome auto-fix)
- **Type Check:** `pnpm run type` (TypeScript)
- **Test All:** `pnpm run test` (lint+type+tests)
- **Tests Only:** `pnpm run spec` (Vitest)
- **Single Test:** `pnpm exec vitest run -t "test name"` or `pnpm exec vitest run path/to/test.ts`

## Style Guidelines
- **Formatting:** 2-space indent, UTF-8, LF endings
- **Types:** Strict TypeScript with null checks
- **Naming:** PascalCase for classes/interfaces, camelCase for methods/variables
- **Imports:** ES modules, organized imports
- **Documentation:** Document public APIs with JSDoc
- **Testing:** Unit tests in `__spec__` folders with descriptive names
