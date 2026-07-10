# Contributing to helpers4

Thank you for your interest in contributing! This guide explains everything you need to know to create high-quality helpers for this project.

## Prerequisites

- **Node.js** >= 26.0.0
- **pnpm** (enabled via corepack: `corepack enable`)
- **Git** with [conventional commits](https://www.conventionalcommits.org/)

```bash
git clone https://github.com/helpers4/typescript.git
cd typescript
pnpm install
```

## Project structure

```
helpers/
  <category>/
    functionName.ts            # Implementation (one function per file)
    functionName.test.ts       # Unit tests (colocated, 100% coverage required)
    functionName.spec.ts       # Property-based + contract tests (fast-check)
    functionName.bench.ts      # Benchmark (optional)
    functionName.example.ts    # Usage examples (required)
    index.ts                   # Auto-generated category re-exports (build output, ignored by Git)
    config.json                # Category metadata
```

Categories: `array`, `ci`, `color`, `commit`, `date`, `function`, `guard`, `id`, `markdown`, `node`, `number`, `object`, `observable`, `promise`, `string`, `type`, `url`, `version`.

## Creating a new helper

### Step 1 — Implementation

Create `helpers/<category>/functionName.ts`:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 <Your Name>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Clamps a number between min and max values.
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * @example
 * clamp(15, 0, 10)
 * // => 10
 * @since next
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

**Rules:**

- **License header** is required on every source file (see above)
- **`any` is forbidden** — use `unknown`, generics, or specific types
- **JSDoc** is required with `@param`, `@returns`, `@example`, and `@since`
- **One function per file** — keep it focused and tree-shakable
- **No side effects** — pure functions only
- Use `readonly` arrays in parameters when the function does not mutate
- 2-space indentation, single quotes
- Always use `@since next` — the real version is injected automatically at stable release time
  (prerelease builds keep `next` so the tag retains its semantic meaning). **Never hard-code a
  version number like `@since 2.0.0`** — the tag will be wrong the moment the release number changes.

### Step 2 — Tests

Create `helpers/<category>/functionName.test.ts`:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 <Your Name>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  it('should return value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should clamp to min when below', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should clamp to max when above', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });

  it('should work with floating point numbers', () => {
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});
```

**Coverage requirement: 100%** on lines, functions, branches, and statements — no exceptions.

**What to test:**
- Normal/happy path with different data types
- Empty inputs
- Edge cases (all match, none match, single element)
- Boundary values
- Type coercion traps (e.g. `0`, `false`, `''`, `null`)
- Callback arguments (value, index, etc.)

Run tests:

```bash
pnpm test                                             # All tests
npx vitest run helpers/<category>/functionName.test.ts # Single file
pnpm test:watch                                       # Watch mode
pnpm test:coverage                                    # With detailed coverage
```

### Step 2b — Property-based & contract tests

Create `helpers/<category>/functionName.spec.ts` alongside the unit test file:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 <Your Name>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import { clamp } from './clamp';

describe('clamp — property-based', () => {
  it('result is always within [min, max]', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        (a, b, value) => {
          const [min, max] = a <= b ? [a, b] : [b, a];
          const result = clamp(value, min, max);
          expect(result).toBeGreaterThanOrEqual(min);
          expect(result).toBeLessThanOrEqual(max);
        },
      ),
    );
  });
});

describe('clamp — contract', () => {
  it('should handle -Infinity as value', () => {
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('should handle +Infinity as value', () => {
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });
});
```

**Two types of tests live in `.spec.ts`:**

1. **Property-based tests** (using `fast-check`) — verify invariants that hold for any input, using randomly generated data. Think of them as "for all inputs, this property must hold".
2. **Contract/boundary tests** — explicit tests on adversarial or boundary inputs (empty strings, `null`, `undefined`, `Infinity`, `NaN`, path traversal sequences, scheme abuse...) that document the function's behavior at its limits.

**Guidelines:**
- Use `fc.assert(fc.property(...))` for property-based tests
- Group them under `describe('functionName — property-based')` and `describe('functionName — contract')`
- Contract tests are especially important for `string/*`, `url/*`, and `version/*`
- `.spec.ts` files are **excluded from coverage measurement** — they test properties, not code branches

Run spec files:

```bash
npx vitest run helpers/<category>/functionName.spec.ts # Single spec file
```

### Step 3 — Examples

Create `helpers/<category>/functionName.example.ts`:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 <Your Name>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from './clamp';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'clamp',
  category: 'number',
  examples: [
    {
      title: 'Clamp a value above max',
      description: 'Returns max when the value exceeds the upper bound.',
      code: `clamp(15, 0, 10)
// => 10`,
      assert: () => {
        if (clamp(15, 0, 10) !== 10)
          throw new Error('Expected 10');
      },
    },
    {
      title: 'Value within range',
      description: 'Returns the value unchanged when it is within bounds.',
      code: `clamp(5, 0, 10)
// => 5`,
      assert: () => {
        if (clamp(5, 0, 10) !== 5)
          throw new Error('Expected 5');
      },
    },
  ],
};

export default examples;
```

Examples serve two purposes:
1. **Smoke tests** — the `assert` functions are executed to validate behavior
2. **Documentation** — `title`, `description`, and `code` are rendered on the website

Run examples: `pnpm examples`

### Step 4 — Export

You do **not** need to manually edit `helpers/<category>/index.ts`.
That file is auto-generated during the build and ignored by Git.

To make your helper available, simply add your implementation as
`helpers/<category>/functionName.ts` — the build will discover it and
generate the category re-exports automatically.

### Step 5 — Benchmark (optional)

Create `helpers/<category>/functionName.bench.ts` for performance-sensitive helpers:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 <Your Name>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  bench('clamp number', () => {
    clamp(15, 0, 10);
  });
});
```

Run benchmarks:

```bash
pnpm bench                                              # All benchmarks
npx vitest bench helpers/<category>/functionName.bench.ts # Single file
pnpm bench:watch                                        # Watch mode
```

Benchmarks are **non-blocking** and **opt-in** — they don't fail the CI and are not required for every
helper. Add a bench file when the function is on a hot path (tight loops, string manipulation on
large inputs, frequent array traversals). Simple one-liners, type guards, and thin wrappers do not
need benchmarks.

## Quality checks

Before submitting, run:

```bash
pnpm test          # Tests pass with 100% coverage
pnpm typecheck     # No type errors (uses tsgo)
pnpm lint          # No lint issues (uses oxlint)
pnpm coherency     # Bundle/version/category consistency
```

## Intentional cross-category duplicates

Some helpers exist in **both `array/` and `object/`** on purpose — do **not** try to deduplicate them:

| Helper | `array/` | `object/` |
|--------|----------|-----------|
| `compact` | removes falsy items from an array | removes falsy values from an object |
| `equalsShallow` | positional `===` comparison | keys + `===` value comparison |

**Why?** Each category is published as its own npm package (`@helpers4/array`, `@helpers4/object`). A user who imports only `@helpers4/array` must not pull in `object/` code — tree-shaking across packages requires the duplication to be explicit.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) with a gitmoji between the scope and the description.

**Format:** `<type>(<scope>): <emoji> <description>`

**Scopes:** `array`, `color`, `commit`, `date`, `function`, `guard`, `id`, `markdown`, `node`, `number`, `object`, `observable`, `promise`, `string`, `type`, `url`, `version`, `CI-CD`

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

```
feat(number): ✨ add clamp helper
fix(date): 🐛 handle invalid timestamp input
test(promise): ✅ add retry edge case tests
```

## Checklist

Before opening a PR, make sure:

- [ ] One function per file, in the correct category
- [ ] License header present on all new files
- [ ] JSDoc with `@param`, `@returns`, `@example`, `@since next`
- [ ] No `any` — use `unknown` or specific types
  - [ ] Tests with **100% coverage** (lines, functions, branches, statements)
  - [ ] Property-based + contract spec file (`functionName.spec.ts`)
- [ ] Example file with at least 2 examples and `assert` functions
- [ ] `pnpm test` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] Commits follow conventional commit format

## Adding a new category

If your helper doesn't fit any existing category:

1. Create `helpers/<new-category>/`
2. Add a `config.json`:
   ```json
   {
     "name": "category-name",
     "description": "Brief description of the category"
   }
   ```
3. The build will auto-generate `index.ts` for the new category
4. Add the scope to the commit convention

## For AI contributors

If you are an AI coding agent contributing to this repo:

- Read `AGENTS.md` at the root for full conventions and restrictions
- **Never use `any`** — the project enforces strict typing
- All code, comments, commits, and documentation must be in **English**
- Follow the exact file structure shown above
- Do **not** push directly — the maintainer will review and push
- Check `docs/native-alternatives.json` before creating a helper that duplicates a native API

## Getting help

- Open an [issue](https://github.com/helpers4/typescript/issues) for questions
- Check `.copilot/GAPS.md` for a list of helpers we'd like to add
- Look at existing helpers as reference implementations

## License

By contributing, you agree that your contributions will be licensed under the [LGPL-3.0-or-later](https://github.com/helpers4/typescript/blob/main/LICENSE) license.
