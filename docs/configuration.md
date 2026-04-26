---
title: Configuration
path: /configuration/
icon: settings
order: 2
description: All fields supported by uptask.config.ts.
---

# Configuration

Uptask reads `uptask.config.ts` from the current working directory by default,
or from the path passed via `-c` / `--config`. The config returns the result
of `defineConfig`, which validates the input against a zod schema and fills
defaults from your project's `package.json`.

## Full shape

```ts title="uptask.config.ts"
import { defineConfig } from "uptask"

export default defineConfig({
  name: "uptask", // default: package.json#name
  version: "0.0.0-dev", // default: package.json#version
  description: "...", // default: package.json#description
  pattern: "@*.ts", // glob applied to file basenames
  groups: [
    { name: "db", pattern: "@db*.ts" }, // see "Groups"
  ],
  setupProgram: program => {
    // optional Commander hook — runs after all commands are attached
    program.name("my-cli")
  },
})
```

Every field is optional. The empty form `defineConfig({})` is valid.

## Field reference

| Field          | Type                                  | Default                    | Notes                                                                                            |
| -------------- | ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `name`         | `string`                              | `package.json#name`        | Program name shown in `--help`.                                                                  |
| `version`      | `string`                              | `package.json#version`     | Surfaced via `--version`.                                                                        |
| `description`  | `string`                              | `package.json#description` | One-line blurb at the top of `--help`.                                                           |
| `pattern`      | `string`                              | `"@*.ts"`                  | Picomatch glob applied to filename basenames during discovery.                                   |
| `groups`       | `{ name: string, pattern: string }[]` | `[]`                       | Subcommand groups. See [Groups](/groups/).                                                       |
| `setupProgram` | `(program: Command) => void`          | `undefined`                | Mutate the Commander program after attachment (rename, add help text, register custom commands). |

## Discovery

`pattern` matches against the **basename only**, not the full path. The same
rule applies to `groups[].pattern`. `.gitignore` rules are honored; uptask
walks up to the repository root (the first ancestor with `.git`) and stops
there, so global ignores from your home directory don't affect discovery.

The discovery cap is system-level: uptask refuses to parse more than 100 files
per invocation. If you hit the cap, narrow `pattern` rather than reaching for
the cap itself.
