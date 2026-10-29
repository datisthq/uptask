---
name: change-review
description: Review a pull request, or the local branch before it lands, for correctness, security and repo conventions — inline PR comments, or a ranked list locally. Invoked by the review workflow or a person; never fires on its own.
disable-model-invocation: true
---

# Review a change

Read the diff, judge it, post findings as inline comments. Be useful, not thorough-looking:
a review that flags twenty things teaches nothing, and the twenty-first — the real one — is lost
in it.

## What to look for

**Correctness**

- Logic that is wrong for an input the change makes reachable, not merely unusual.
- Error handling that swallows a failure or reports success on a partial write.
- Concurrency: two invocations at once, an async task function whose rejection escapes.
- Performance where the change makes it structurally worse (a re-parse per module, an unbounded
  glob), not where it is merely not optimal.

**Security — OWASP-shaped, but reported only when reachable**

- Injection (SQL and otherwise), XSS, SSRF, XXE, unsafe deserialisation: CLI input, a task file
  path or config value reaching a shell, `eval` or a dynamic `import()`.
- Broken authentication or access control: a pattern, group or config path resolving outside the
  project root, or discovery ignoring `.gitignore`.
- Sensitive data exposure: secrets in code or logs, or a private file reaching the docs site.
- Insecure cryptography, race conditions and TOCTOU, missing logging on a security-relevant
  action.

**This repo's own invariants** — these are where a generic reviewer is blind, and they matter
more than the generic checklist:

- a change to `source/index.ts`, the `bin` or `exports` in `package.json`, or a config field in
  `source/models/config.ts` that breaks an existing project;
- a change to how a parameter maps to the CLI (argument or option, name, type, default,
  optionality, validation): every project's commands shift silently, so it needs a unit test
  and the matching `docs/` page;
- a config field or CLI behaviour added or changed with its `docs/` page left as it was;
- a commit typed `feat` or `fix` that does not change what an installer gets, or a package change
  typed `chore`;
- a commit marked breaking (`!` or a `BREAKING CHANGE:` footer);
- `AGENTS.md`, a skill or `CONTRIBUTING.md` that the diff made untrue (**`human-documentation`**).

The relevant skill explains each of these — `human-documentation`, `change-verification`.

## How to report

Rate each finding **CRITICAL / HIGH / MEDIUM / LOW**, and say what input or sequence produces
the failure. A finding that cannot name the case that breaks is a hunch: either verify it or
leave it out.

Post specific issues as inline comments on the lines they concern. Keep the summary short.
Silence on the parts that are fine is not laziness — it is what makes the flagged parts legible.

If the change is good, say so briefly and stop. Do not manufacture findings to justify the run.

## Reviewing locally

With no pull request — a person running `/change-review` in a checkout, or `issue-resolution` before
it commits — the change is everything this branch adds over `main`: `git diff main...HEAD` plus the
uncommitted and untracked files. Judge it by the same rules, then print the findings in the terminal,
worst first, each with its `file:line`. Post nothing, and edit nothing unless the caller asks for the
fixes.
