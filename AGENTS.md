# AGENTS.md — typescript

→ [Org-wide rules](https://github.com/helpers4/.dev/blob/main/AGENTS.md): restrictions · commit format · license headers

## This Repository

**Purpose:** Tree-shakable TypeScript utility functions, one npm package per category.
**Stack:** Node.js ≥26 · TypeScript 5.7 strict · pnpm · Vite+Rollup · Vitest (100% coverage) · fast-check · oxlint

```text
helpers/<category>/
├── functionName.ts          # one function per file
├── functionName.test.ts     # unit tests — 100% coverage required
├── functionName.spec.ts     # property-based tests (fast-check)
├── functionName.bench.ts    # optional benchmark
├── _internalHelper.ts       # internal only — not exported, use @ignore not @since
└── index.ts                 # auto-generated barrel (do not edit)
```

**Key commands:**

```bash
pnpm test && pnpm build && pnpm lint && pnpm typecheck && pnpm coherency
pnpm version:patch|minor|major|prerelease
pnpm release:auto
```

**Rules:**

- `any` forbidden — use `unknown` or specific types
- JSDoc on all exports: `@param` `@returns` `@example` `@since <version>`
  - Not yet released → `@since next` (replaced at publish time)
  - Existing `@since x.x.x` → **never change** (records first published version)
- 100% coverage: lines, functions, branches, statements — no exceptions
- Tree-shakable exports only (no side effects)

**Helper placement:**

- Type predicates `is<Type>` → `guard/` (return a runtime type guard). Exception: Node.js-specific ones (`isBuffer`, `isNodeStream`) → `node/` (depend on Node globals unavailable in browsers)
- Compile-time-only utility types (`Brand`, `DeepGet`, `DeepSet`, ...) → `type/` (no runtime footprint)
- State predicates (`isEmpty`, `isNonEmpty`) → their own category, never `type/`
- `compact` and `equalsShallow` exist in both `array/` and `object/` intentionally — do **not**
  merge: the implementations are genuinely different (array-element filtering vs.
  object-entry filtering), not copy-pasted duplicates
- Cross-category imports of **public** helpers are safe and an established pattern (e.g.
  `array/sample.ts` imports `number/clamp`, `object/diff.ts` imports `array/equalsDeep` and
  `date/compare`) — Rollup inlines them per-package at build time (`build/<category>/package.json`
  has no `dependencies`), so tree-shaking and package independence are unaffected. `_shared/` is
  only for logic with no natural public "owner" on either side.

**License header (all source files):**

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */
```
