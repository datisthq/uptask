---
name: change-verification
description: Use when checking a change works before calling it done — the smallest lint/type/unit slice and a run of the CLI or a look at the site for the diff, not the full gate. Covers check costs, the slice ladder, the docs guard and the commit gate.
---

# Verifying a change

**Verify the diff, not the repo.** `pnpm test` is lint + type + unit over everything. A copy fix
on the landing page cannot break module discovery, so running every unit test checks nothing.
While iterating, run the **slice** that could catch this diff breaking. The full gate belongs to
the lefthook pre-push hook and CI. A local session runs `pnpm test` only for a build-shaped diff
(rung 4); a commit runs the **commit gate** below.

- Never re-run a check that passed if nothing it covers has changed.
- Never chain two heavy commands in one call. One that fails hides the cost of the other.
- Say in the report which slice ran (e.g. "fmt+lint on 2 files, tsgo, parameter tests, CLI
  `--help`"). Never write "tests pass" for a slice.

## What each check costs

| check                                        | catches                                 |
| -------------------------------------------- | --------------------------------------- |
| `vp fmt --check <files>` / `vp lint <files>` | format, oxlint                          |
| `pnpm check:lint`                            | format and lint everywhere              |
| `pnpm check:types`                           | types everywhere                        |
| `vp test <file or dir>`                      | the tests named                         |
| `vp test related <files> --run`              | every test importing the files          |
| `pnpm test:unit`                             | every unit test, including the guards   |
| `pnpm build`                                 | the `tsgo` emit the `uptask` bin loads  |
| `pnpm build:docs`                            | the real build of this repo's docs site |

Each takes seconds; ts-morph parsing makes the unit tests the slowest. All run from the repo root
(or the worktree root). Raw `vitest` fails to collect `vite-plus/test` suites. The changed files
come from `git diff --name-only main...` plus `git status --short`.

## The ladder

Pick the **highest** rung the diff reaches, and run everything that rung lists.

1. **Markdown, copy, CSS.** `vp fmt --check` on the files. For `AGENTS.md`, `README.md`,
   `CONTRIBUTING.md` or a skill, add `vp test scripts/-test/docs.unit.ts`: it checks every
   backticked path and `pnpm` command those documents name.
2. **The docs site** — anything under `.livemark/` or `livemark.config.ts`. fmt + lint on the
   files, `pnpm build:docs`, and **look at it**: `pnpm start`, then open the page in Claude in
   Chrome, in light and dark and at a phone width. No unit test renders the site.
3. **Logic** — an action, helper or model. Add `pnpm check:types` and
   `vp test related <files> --run`. A new or changed test runs on its own first
   (`vp test <file>`), and fails before the fix. When the CLI a task file yields changes, also
   run it: `pnpm build`, then `node build/entrypoints/main.js --help` and the command at hand.
4. **Build-shaped** — `main.ts`, `entrypoints/`, `index.ts`, dependencies, `vite.config.ts`, a
   `tsconfig`, `package.json`. Run `pnpm test`, then `pnpm build` and
   `node build/entrypoints/main.js --help`. No cherry-picking here.

## Guards `related` cannot see

`scripts/-test/docs.unit.ts` reads documents from disk and imports nothing, so
`vp test related` never selects it. Add it by path whenever the diff touches `AGENTS.md`,
`README.md`, `CONTRIBUTING.md`, a skill, a renamed path or a renamed script.

## The commit gate

A commit on `main`, and landing a worktree branch (**`worktree-workflow`**), run the **commit
gate** once, at the end: `pnpm check` always, then a unit half **you choose**.

- `pnpm check` = `check:lint` + `check:types` over the whole package.
- **`pnpm test:unit`** when the diff is build-shaped, changes shared code many modules import
  (`settings.ts`, a model, a helper), or you are unsure.
- **Cherry-pick** otherwise: `vp test related <files> --run` plus every guard above the diff
  triggers.
- Unsure? Run `pnpm test:unit`. Pre-push and CI run everything, but a break they catch has already
  landed on `main` under somebody else's work.
- The report names the path taken: "check + test:unit", or "check + related, docs guard".

## When the slice is not enough

- **The slice fails somewhere unexpected.** The diff reaches further than you thought. Go up a
  rung; do not narrow the slice until it passes.
- **Snapshots.** A changed snapshot under `fixtures/generated/` is an output change: read the
  diff before accepting it with `vp test -u`, never accept it blind.
