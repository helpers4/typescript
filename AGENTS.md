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
- Cancellation: a helper that starts something lasting (a timer, a frame, a listener, an
  observer, a queued wait, a loop of async calls) accepts `signal?: AbortSignalLike` (`helpers/type/AbortSignalLike`) in an
  options object — the W3C design principle "Cancel asynchronous APIs/operations using AbortSignal".
  One `abort()` then stops everything a caller started, which is what an unmount, a navigation
  or a GNOME Shell `disable()` needs.
  - A returned promise rejects with `signal.reason`, at once if the signal is already aborted,
    and never stays pending: a promise that never settles skips the caller's `finally`.
  - A returned handle (`cancel()`, a cleanup function) stays as a shortcut; aborting does the same.
  - Remove the abort listener once the work ends on its own, or it piles up on a long-lived signal.
  - Only touch `signal.aborted`, `signal.reason` and `add`/`removeEventListener` (see
    `helpers/_shared/_onAbort.ts`), and never reference the `AbortController` global: some
    runtimes (GJS) only have a polyfill, or none when no signal is passed. That is why the option
    type is `AbortSignalLike`, which names no DOM type: a real `AbortSignal` is assignable to it.
  - Outside `browser`/`node`, the published `index.d.ts` of a category must compile with no DOM
    lib and no Node types (`pnpm coherency:no-dom`). Only `fetch` (it wraps the Fetch API),
    `promise` (the deprecated `fetch*` aliases, until v4 removes them) and `guard` (`isBlob`,
    `isFormData`) are exempt for now.
- Breaking changes: use the real Conventional Commits `BREAKING CHANGE:` footer (own paragraph,
  literal uppercase token) — `git-cliff` (CHANGELOG.md generation, see `cliff.toml`) only detects
  that exact syntax. Prose like "Breaking change for v3." in the body is invisible to it.

**Helper placement:**

- Outside the API-specific categories (`browser/`, `node/`), a helper must work on every runtime: no
  unguarded `document`, `window` or `process`. It either falls back (`frameLoop` uses a timer when
  `requestAnimationFrame` is missing) or takes what it needs as an argument (`relativeURLToAbsolute`
  takes a `base`). A helper that cannot work without a runtime API belongs in that runtime's category.

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

**Packages built outside `helpers/`:** `build/` holds more than the categories, and every script
that walks it (coherency, publish, website docs) must know these:

| Package | Source | Built by | Notes |
| --- | --- | --- | --- |
| `@helpers4/all` | `.template/bundle` | `build-bundle.ts` | No code: `peerDependencies` on every category and on `@helpers4/presets` |
| `helpers4` | `.template/unified` | `build-unified.ts` | Re-export shims per category; `presets/` is a **copy** of `@helpers4/presets` (tools read those files by path) |
| `@helpers4/presets` | `presets/` | `build-presets.ts` | Shared tool configs (tsconfig, oxlint, oxfmt, Vitest, Stryker, cspell, EditorConfig, git-cliff). No `lib/`, no `meta/`, not documented as a category. Every file needs an `exports` entry in `presets/package.json` |

The repository uses its own `presets/`: the root `tsconfig.json`, `.oxlintrc.json`, `.cspell.json` and
`vitest.config.ts` extend it, so lint, typecheck and tests validate the presets. A stricter preset
can break consumers' builds: say so in the commit (`BREAKING CHANGE:` when it does).

**License header (all source files):**

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) <year> baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */
```

`<year>` is the year the file is created. Existing headers keep their year (`2025` for most of the
library) — never rewrite them.
