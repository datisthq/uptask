# Uptask

Point uptask at a glob. Every function exported from a matching file becomes
a CLI command — argument names, types, defaults, optional flags, and `--help`
descriptions are all derived from the function's signature and JSDoc. No
decorators, no boilerplate, no config required — just write functions.

## Install

```bash
pnpm add -D uptask
# or
npm install --save-dev uptask
```

## Write a task file

The default scan pattern is `@*.ts`. Create one anywhere in your project:

```ts title="@build.ts"
/**
 * Build the project.
 *
 * @param target Build target name
 * @param watch Enable watch mode
 * @param concurrency Number of parallel builds
 */
export function build(
  target: string,
  watch: boolean = false,
  concurrency: number = 4,
) {
  console.log({ target, watch, concurrency })
}
```

Required positional types (`string`, `number`) become arguments. Optional or
boolean parameters become `--flag` options. JSDoc descriptions surface in
`--help`.

## Add a config file

A minimal `uptask.config.ts` at the project root:

```ts title="uptask.config.ts"
import { defineConfig } from "uptask"

export default defineConfig({
  // pattern: "@*.ts" by default
  // groups: [] by default — see "Groups"
})
```

The config is optional. Without one, uptask uses sensible defaults derived from
`package.json`.

## Run

Add a `bin` entry or run via `pnpm exec`:

```bash
pnpm exec uptask --help
pnpm exec uptask build my-target --watch
```

Each exported function gets `--help` of its own — argument descriptions and
default values come straight from the JSDoc and the parameter signature.
