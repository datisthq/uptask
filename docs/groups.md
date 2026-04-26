---
title: Groups
path: /groups/
icon: folder-tree
order: 3
description: Carve the top level into named subcommand areas.
---

# Groups

By default every exported function attaches as a flat top-level command. Once
you have more than a handful, you'll want to group them. Uptask does this via
opt-in `config.groups[]` entries, each declaring `{ name, pattern }`. After
discovery, every matched file is tested against each group's pattern; matched
files' functions attach under that group's parent command instead of at the
root.

## Example

```ts title="uptask.config.ts"
import { defineConfig } from "uptask"

export default defineConfig({
  groups: [
    { name: "db", pattern: "@db*.ts" },
    { name: "build", pattern: "@build*.ts" },
  ],
})
```

With `@db.ts` exporting `migrate` and `seed`, and `@build.ts` exporting `run`:

```bash
uptask --help        # → top-level commands plus `db` and `build`
uptask db --help     # → migrate, seed
uptask db migrate    # → runs the migrate function
```

Files that match no group stay flat, so adding a single group doesn't
re-shape the rest of your CLI.

## Matching rules

- Patterns are picomatch globs matched against the **filename basename**, the
  same rule as `config.pattern`.
- First-declared-wins when multiple groups would match the same file.
- A group with no matching files is silently dropped — no empty parent
  command appears in `--help`.
- Group order in `config.groups[]` is preserved in `--help` output.

## Naming

The function's name is used verbatim as the subcommand label — no prefix
stripping. So a function `migrate` in a `db`-grouped file becomes
`uptask db migrate`, not `uptask db db-migrate`.
