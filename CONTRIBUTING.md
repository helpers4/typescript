# Contributing to helpers4

Thank you for your interest in contributing! This guide explains everything you need to know to create high-quality helpers for this project.

## Prerequisites

- **Node.js** >= 20.0.0 (24 LTS recommended)
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
    functionName.test.ts       # Tests (colocated, 100% coverage required)
    functionName.bench.ts      # Benchmark (optional)
    functionName.example.ts    # Usage examples (required)
    index.ts                   # Re-exports all helpers in the category
    config.json                # Category metadata
```

Categories: `array`, `date`, `function`, `math`, `number`, `object`, `observable`, `promise`, `string`, `type`, `url`, `version`.

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
 * @since 2.0.0
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
- Target the current version for `@since` (check `package.json`)

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

Add your function to `helpers/<category>/index.ts`:

```typescript
export * from './functionName';
```

Keep exports in **alphabetical order**.

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

Benchmarks are **non-blocking** — they don't fail the CI, but they help track performance regressions.

## Quality checks

Before submitting, run:

```bash
pnpm test          # Tests pass with 100% coverage
pnpm typecheck     # No type errors (uses tsgo)
pnpm lint          # No lint issues (uses oxlint)
pnpm coherency     # Bundle/version/category consistency
```

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) with a gitmoji between the scope and the description.

**Format:** `<type>(<scope>): <emoji> <description>`

**Scopes:** `array`, `date`, `function`, `math`, `number`, `object`, `observable`, `promise`, `string`, `type`, `url`, `version`, `CI-CD`

| Emoji | Type | Description |
|-------|------|-------------|
| ✨ | feat | New feature |
| 🐛 | fix | Bug fix |
| 📝 | docs | Documentation |
| ♻️ | refactor | Code refactoring |
| ✅ | test | Tests |
| 🔧 | chore | Maintenance |
| 🚀 | perf | Performance |

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
- [ ] JSDoc with `@param`, `@returns`, `@example`, `@since`
- [ ] No `any` — use `unknown` or specific types
- [ ] Tests with **100% coverage** (lines, functions, branches, statements)
- [ ] Example file with at least 2 examples and `assert` functions
- [ ] Export added to `index.ts` (alphabetical order)
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
3. Create `index.ts` with your exports
4. Add the scope to the commit convention

## For AI contributors

If you are an AI coding agent contributing to this repo:

- Read `AGENTS.md` at the root for full conventions and restrictions
- **Never use `any`** — the project enforces strict typing
- All code, comments, commits, and documentation must be in **English**
- Follow the exact file structure shown above
- Do **not** push directly — the maintainer will review and push
- Check `scripts/constants/native-alternatives.json` before creating a helper that duplicates a native API

## Getting help

- Open an [issue](https://github.com/helpers4/typescript/issues) for questions
- Check `.copilot/GAPS.md` for a list of helpers we'd like to add
- Look at existing helpers as reference implementations

## License

By contributing, you agree that your contributions will be licensed under the [LGPL-3.0-or-later](LICENSE) license.
