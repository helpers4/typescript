---
name: add-helper
description: Scaffold a new helpers4 function — implementation, tests, spec, and example — following this repo's conventions
---

Add a new helper function to `helpers4/typescript`, end to end. Ask the user for the function's
name/behavior first if it wasn't already specified.

## 1. Placement

- Pick the right category under `helpers/<category>/` — see `AGENTS.md`'s "Helper placement"
  rules (type predicates → `guard/`, compile-time-only types → `type/`, Node-only APIs →
  `node/`, state predicates like `isEmpty` → their own category, never `type/`).
- Check `docs/native-alternatives.json` first — don't add a helper that duplicates a native
  JS/TS API.
- Naming: prefer a plain-English, self-describing name over lodash/radashi/math jargon (e.g.
  `symmetricDifference` not `xor`, `removeDiacritics` not `deburr`). If unsure, propose the name
  as a question rather than assuming the jargon term will be accepted.
- Cross-category imports of **public** helpers are fine and already an established pattern
  (e.g. `array/sample.ts` imports `number/clamp`) — Rollup inlines them per-package at build
  time, so tree-shaking and package independence are unaffected. Don't avoid them out of
  caution. `array`/`object` having *intentionally duplicated* `compact`/`equalsShallow` is the
  one deliberate exception — see `AGENTS.md`.

## 2. Create the four files

Follow `CONTRIBUTING.md`'s "Creating a new helper" section (Steps 1–3) for the exact file
templates:

- `helpers/<category>/<name>.ts` — implementation + LGPL-3.0-or-later license header + JSDoc
  (`@param`, `@returns`, `@example`, `@since next` — **never** a hardcoded version number)
- `helpers/<category>/<name>.test.ts` — Vitest unit tests; **100% coverage required** (lines,
  functions, branches, statements)
- `helpers/<category>/<name>.spec.ts` — `fast-check` property-based tests plus contract/boundary
  tests (empty/null/undefined, `NaN`, `Infinity`, adversarial inputs); excluded from coverage
  measurement, so it's for invariants, not branch-hunting
- `helpers/<category>/<name>.example.ts` — a `HelperExamples` default export (see
  `scripts/examples/types.ts`) with ≥2 examples, each with a `title`, `description`, `code`
  string, and a throwing `assert()`

Do **not** hand-edit `helpers/<category>/index.ts` — it's generated at build time and
gitignored; the build discovers new files automatically.

If a `?.`/`??` short-circuit can never actually be reached given the calling context, prefer a
non-null assertion (`!`) with a one-line comment explaining why — an unreachable branch fails
the 100% branch-coverage requirement.

## 3. Verify, in this order

```bash
pnpm typecheck && pnpm lint && pnpm test:coverage && pnpm build && pnpm coherency && pnpm examples
```

All must pass. Check `pnpm test:coverage`'s per-file output for the new files specifically —
100% on the aggregate can hide a gap in exactly the file just added.

## 4. Commit

Only if explicitly asked to commit *this turn* — per `.dev/AGENTS.md`, commit authorization is
per-turn, not a standing grant, even if a past session committed freely. When authorized, one
commit scoped to the category, following the commit format in `CONTRIBUTING.md`
(`<type>(<scope>): <emoji> <description>`, scope from `scopes.json`).
