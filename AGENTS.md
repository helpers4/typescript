# AGENTS.md - TypeScript Helpers Library

## ⛔ CRITICAL RESTRICTIONS

- **NEVER execute `git push`** - The user will push manually after review
- **NEVER use GPT models** - Use Claude models only (claude-sonnet-4, Claude Opus 4.5)
- **Everything in English** - Code, comments, commits, documentation, logs, PR descriptions

## Organization Context

**helpers4** is a collection of open-source utilities across 5 repos: `typescript` (this repo), `devcontainer`, `action`, `website`, `.github`. All licensed LGPL-3.0.

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) with a gitmoji between the scope and the description.

**Format:** `<type>(<scope>): <emoji> <description>`

**Scopes:** defined in VSCode settings, within the `"conventionalCommits.scopes"` array (e.g. `array`, `string`, `ci`, etc.) — pick the most specific applicable scope.

| Type | Primary | Alternatives (gitmoji.dev) | When to use |
|------|---------|---------------------------|-------------|
| feat | ✨ | 🚸 UX, ♿️ a11y, 🌐 i18n, 💬 text/literals | New feature |
| fix | 🐛 | 🚑️ hotfix, 🔒️ security, 🩹 trivial, 🥅 errors, 🚨 warnings, ✏️ typo | Bug fix |
| docs | 📝 | 💡 source comments, 📄 license | Documentation |
| refactor | ♻️ | 🎨 structure, 🔥 remove code, ⚰️ dead code, 🚚 move/rename | Code refactoring |
| test | ✅ | 🧪 failing test, 💚 fix CI test | Tests |
| chore | 🔧 | 🙈 gitignore, 🔖 tag/release, 📌 pin deps, 🩺 healthcheck | Maintenance |
| perf | ⚡️ | — | Performance |
| style | 💄 | 🎨 code style | Code style / UI |
| ci | 👷 | 💚 fix CI | CI/CD |
| build | 📦️ | ➕ add dep, ➖ remove dep, ⬆️ upgrade dep, ⬇️ downgrade dep | Build system |
| revert | ⏪️ | — | Revert |

> Pick the **most specific** gitmoji that matches the change. The primary is the safe default; reach for an alternative when it adds real signal. Full list: https://gitmoji.dev

**Examples:**
- `feat(array): ✨ add flatMap helper`
- `fix(date): 🐛 handle invalid timestamp input`
- `test(promise): ✅ add retry edge case tests`
- `refactor(object): ♻️ simplify deepMerge logic`

---

## This Repository

**Purpose:** Tree-shakable TypeScript utility functions organized by category.

### Tech Stack

- **Node.js** >= 24.0.0
- **TypeScript** 5.7.2 (strict mode, no `any`)
- **Package Manager:** pnpm
- **Build:** Vite 7.x + Rollup (ES modules + declarations)
- **Testing:** Vitest (100% coverage enforced) + fast-check (property-based)
- **Benchmarking:** Vitest Bench (non-blocking, informational)
- **Linting:** oxlint

### Project Structure

```
typescript/
├── helpers/                   # 13 helper categories
│   ├── array/                 # arrayEquals, chunk, deepCompare, difference, intersection, ...
│   ├── id/                    # uuid7, ...
│   ├── commit/                # commit message parsing + validation
│   ├── date/                  # daysDifference, isSameDay, toISO8601, ...
│   ├── function/              # debounce, throttle, ...
│   ├── node/                  # Node.js-specific utilities (isBuffer, ...)
│   ├── number/                # clamp, isEven, isOdd, ...
│   ├── object/                # deepMerge, pick, omit, ...
│   ├── observable/            # RxJS utilities
│   ├── promise/               # delay, retry, consoleLogPromise, ...
│   ├── string/                # camelCase, capitalize, kebabCase, slugify, ...
│   ├── type/                  # isArray, isBoolean, isString, isNull, ...
│   ├── url/                   # cleanPath, extractPureURI, onlyPath, ...
│   └── version/               # semver comparison utilities
├── build/                     # Compiled output (one dir per category + all/)
├── docs/
│   └── native-alternatives.json  # Native JS/TS equivalents — check before adding helpers
├── scripts/
│   ├── build/                 # Build orchestrator
│   ├── coherency/             # Consistency checks (bundle, version, category, deps, sizes)
│   ├── license/               # License header injection
│   ├── publish/               # npm publication
│   ├── version/               # Version management + release coordinator
│   ├── tests/                 # Test utilities
│   └── utils/                 # Shared utilities
├── package.json               # v2.0.0-alpha.3
├── tsconfig.json
└── vitest.config.ts           # 100% coverage thresholds
```

### Key Commands

```bash
# Testing
pnpm test                     # Single run with coverage
pnpm test:watch               # Watch mode
pnpm test:coverage            # Detailed coverage

# Building
pnpm build                    # Full build with category bundling

# Benchmarking
pnpm bench                    # Run all benchmarks (single run)
pnpm bench:watch              # Watch mode

# Quality
pnpm lint                     # oxlint --fix
pnpm typecheck                # tsc --noEmit

# Coherency (parallel checks)
pnpm coherency                # All checks
pnpm coherency:bundle         # Bundling consistency
pnpm coherency:version        # Version consistency
pnpm coherency:category       # Category structure
pnpm coherency:dependencies   # Dependency validation
pnpm coherency:sizes          # Bundle size checks

# Release
pnpm version:patch|minor|major|prerelease
pnpm release:patch|minor|major|prerelease|auto
pnpm release:validate
```

### Code Conventions

**File structure per category:**
```
helpers/<category>/
├── functionName.ts            # One function per file
├── functionName.test.ts       # Colocated unit tests (100% coverage required)
├── functionName.spec.ts       # Property-based + contract tests (fast-check)
├── functionName.bench.ts      # Optional benchmark
├── index.ts                   # Re-exports all helpers
└── config.json                # Category metadata
```

**TypeScript rules:**
- `any` is **FORBIDDEN** — use `unknown` or specific types
- JSDoc required on all exports: `@param`, `@returns`, `@example`, `@since <version>`
  - For **new exports** (not yet released): use the literal token `@since next`. The release script replaces it with the actual version at publish time.
  - For **existing exports** that already have `@since x.x.x`: **NEVER change it** — the version records when the API was first published and must stay accurate.
  - Rule of thumb: if a `@since` tag already has a real version number, leave it exactly as-is.
- 2-space indentation, single quotes
- Tree-shakable exports only (no side effects)

**Coverage:** 100% lines, functions, branches, statements — no exceptions.

### Helper Placement

**Type predicates** (`is<Type>`) → `type/` category.
These answer "what *type* is this value?" and return a TypeScript type guard.
Examples: `isArray`, `isString`, `isNull`, `isPromise`.

**Exception — `node/` category:** Node.js-specific type predicates (`isBuffer`, `isNodeStream`,
`isSharedArrayBuffer`) live in `node/` rather than `type/` because they depend on Node.js
globals that are unavailable in browser environments, making them incompatible with the
browser-safe `type/` category. New Node.js-specific `is*` predicates should follow the same
pattern and belong in `node/`.

**State predicates** → **their own category**, never `type/`.
These answer "what *state* is this value in?" and are category-specific.
Category-specific examples:

- `isEmpty` for arrays → `array/isEmpty` (not `type/isEmpty`)
- `isEmpty` for objects → `object/isEmpty`
- `isEmpty` for strings → `string/isEmpty`
- `isNonEmpty` for arrays → `array/isNonEmpty`

The distinction: a type predicate narrows the TypeScript type (`value is T`); a state predicate
checks a runtime condition within an already-known type context (e.g. an array that happens to be
empty). Mixing both in `type/` blurs the category boundary and makes callers import unrelated logic.

**Intentional cross-category duplicates:** `compact` and `equalsShallow` exist in both `array/` and `object/`. Do **NOT** merge or deduplicate them — each category is an independent npm package and cross-package imports break tree-shaking.

### License Header (required on all source files)

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */
```

### Build Pipeline

1. Clean `build/` directory
2. Build individual categories via Rollup
3. Build unified bundle (`build/all/`)
4. Output: ES modules + TypeScript declarations

## Repository Links

- TypeScript: https://github.com/helpers4/typescript
- DevContainer: https://github.com/helpers4/devcontainer
- Actions: https://github.com/helpers4/action
- Website: https://github.com/helpers4/website
- Organization: https://github.com/helpers4

## Questions?

If you need clarification on any aspect, open an issue or comment on the PR. We're here to help!
