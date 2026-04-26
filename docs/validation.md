---
title: Validation
path: /validation/
icon: shield-check
order: 4
description: How uptask validates CLI input against your function's TypeScript types.
---

# Validation

Uptask extracts each function's parameter shape via the TypeScript compiler
and builds a runtime zod schema from it. Every CLI-derived value runs through
its schema before your function is invoked.

## What gets validated

Each parameter — positional argument or option — produces a zod schema:

| Parameter type | Schema                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| `string`       | `z.string()`                                                              |
| `number`       | `z.number()`                                                              |
| `boolean`      | `z.boolean()`                                                             |
| `string[]`     | `z.array(z.string())`                                                     |
| `number[]`     | `z.array(z.number())`                                                     |
| `object`       | `z.object({ ... })` (inline shape) or `z.record(z.string(), z.unknown())` |

Optional parameters are wrapped in `.optional()`. Object parameters with a
known property shape recurse — nested `port: number` inside an object is
validated as a number.

## What it catches

Commander coerces input first (`Number(val)`, `JSON.parse(json)`,
option aggregation), then zod validates the result. The combination catches:

- `--port abc` → `Number("abc")` is `NaN` → zod rejects.
- `--config "42"` → `JSON.parse("42")` is `42`, not an object → zod rejects.
- `--config '{"port": "80"}'` declared as `{ port: number }` → zod rejects
  the string-typed `port`.

## Error format

Validation failures come out as a single line, no stack trace, exit code 1:

```
error: invalid argument 'concurrency': expected number, received nan
```

Nested object property failures include the path:

```
error: invalid argument 'options.port': expected number, received string
```

The shape mirrors Commander's own errors (`error: missing required argument
'target'`) so users see one consistent style across both kinds of input
problems.
