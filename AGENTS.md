# AGENTS.md - AI Coding Agent Instructions

This file provides context and guidelines for AI coding agents (GitHub Copilot, Claude, etc.) working on this repository.

## Project Overview

**@helpers4** is a TypeScript utility library providing standalone, tree-shakable helper functions organized by category. The library is designed to be framework-agnostic and optimized for modern JavaScript/TypeScript projects.

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | >= 24.0.0 |
| Package Manager | pnpm | 9.15.4 |
| Language | TypeScript | 5.x |
| Build | Vite + Rollup | 6.x |
| Testing | Vitest | 2.x |
| Linting | oxlint | 0.16.x |
| Type Declarations | rollup-plugin-dts | 6.x |
| TypeScript Execution | tsx | 4.x |

## Project Structure

```
helpers4/
├── helpers/           # Source code - helper functions by category
│   ├── array/         # Array utilities (chunk, unique, intersection, etc.)
│   ├── date/          # Date utilities (compare, format, safeDate, etc.)
│   ├── function/      # Function utilities (debounce, throttle, memoize)
│   ├── math/          # Math utilities
│   ├── number/        # Number utilities (clamp, random, roundTo)
│   ├── object/        # Object utilities (deepClone, deepMerge, deepCompare)
│   ├── observable/    # RxJS Observable helpers
│   ├── promise/       # Promise utilities
│   ├── string/        # String manipulation helpers
│   ├── type/          # Type utilities and guards
│   ├── url/           # URL manipulation helpers
│   └── version/       # SemVer utilities (parse, compare, increment)
├── build/             # Build output (generated)
├── scripts/           # Build and automation scripts
│   ├── build/         # Build system (Vite + Rollup)
│   ├── coherency/     # Project coherency checks
│   ├── version/       # Version management
│   └── publish/       # Publishing automation
└── .github/           # GitHub Actions workflows
```

## Coding Conventions

### File Structure
- Each helper function lives in its own file: `functionName.ts`
- Tests are colocated: `functionName.test.ts` (Vitest) or `functionName.spec.ts`
- Each category has an `index.ts` that re-exports all helpers
- Each category has a `config.json` for build configuration

### Naming Conventions
- **Functions**: camelCase (e.g., `deepCompare`, `toISO8601`)
- **Types/Interfaces**: PascalCase (e.g., `ParsedVersion`)
- **Files**: Same as function name (e.g., `deepCompare.ts`)
- **Comparison functions**: Use consistent naming (`compare`, `quickCompare`, `deepCompare`)

### Code Style
- Use TypeScript strict mode
- **The `any` type is strictly forbidden** - use `unknown` for truly unknown types, or specific union types
- Export functions individually (for tree-shaking)
- Include JSDoc comments with `@param`, `@returns`, `@example`
- Use single quotes for strings
- Use 2-space indentation
- No semicolons (handled by formatter)

### File Header
Every source file must include the license header:
```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
```

## Testing Guidelines

### Framework
- **Vitest** for all tests
- Test environment: `happy-dom` (for DOM-related tests)

### Test Structure
```typescript
import { describe, expect, it } from 'vitest';
import { functionName } from './functionName';

describe('functionName', () => {
  it('should do something', () => {
    expect(functionName(input)).toBe(expected);
  });
});
```

### Running Tests
```bash
pnpm test                    # Run all tests
pnpm test path/to/file       # Run specific test file
pnpm test:watch              # Watch mode
pnpm test:coverage           # With coverage
```

## Build System

### Commands
```bash
pnpm build                   # Build all packages
pnpm typecheck               # TypeScript type checking
pnpm lint                    # Run oxlint with auto-fix
```

### Build Output
- Each category builds to `build/<category>/`
- Generates both `.js` (ESM) and `.d.ts` files
- Bundle package at `build/all/` includes everything

## Standards & Specifications

### SemVer 2.0.0
Version helpers follow [SemVer 2.0.0](https://semver.org/):
- Core version: `MAJOR.MINOR.PATCH`
- Pre-release: `-alpha`, `-beta.1`, `-rc.1`
- Build metadata: `+build`, `+sha.abc123` (ignored in comparison)

### Date Formats
- **ISO 8601**: `YYYY-MM-DDTHH:mm:ss.sssZ`
- **RFC 3339**: `YYYY-MM-DDTHH:mm:ssZ` (profile of ISO 8601)
- **RFC 2822**: `Day, DD Mon YYYY HH:mm:ss +0000` (email/HTTP headers)

## CI/CD

### GitHub Actions
- **Node.js 24** with **pnpm**
- Tests run on push/PR to main branches
- Build verification on all PRs

### DevContainer
- Base image: `typescript-node:24`
- pnpm store persisted via Docker volume
- Corepack enabled for pnpm management

## Common Tasks for AI Agents

### Adding a New Helper
1. Create `helpers/<category>/newHelper.ts` with license header
2. Create `helpers/<category>/newHelper.test.ts` with comprehensive tests
3. Export from `helpers/<category>/index.ts`
4. Run tests: `pnpm test helpers/<category>/`
5. Commit with conventional commit message

### Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/) with emojis:

```
<type>(<scope>): <emoji> <description>

- Detail 1
- Detail 2
```

**Types & Emojis**:
- `feat`: ✨ New feature
- `fix`: 🐛 Bug fix
- `refactor`: ♻️ Code refactoring
- `docs`: 📚 Documentation
- `test`: 🧪 Tests
- `chore`: 🔧 Maintenance
- `ci`: 🏗️ CI/CD changes

### Modifying Existing Code
1. Read the existing implementation and tests
2. Understand the contract/interface
3. Make minimal, focused changes
4. Update tests if behavior changes
5. Run `pnpm test` to verify
6. Run `pnpm typecheck` for type safety

## Important Notes

- **Tree-shaking**: All exports must support tree-shaking
- **No side effects**: Helper functions should be pure when possible
- **Backward compatibility**: Maintain API compatibility in minor/patch versions
- **TypeScript first**: Always provide proper types
- **Test coverage**: Aim for comprehensive test coverage on all helpers

## Dependencies

### Runtime Dependencies (used in helpers)
- `rxjs`: Observable utilities
- `radashi`: Utility functions
- `simple-deepcompare`: Deep comparison
- `angular-oauth2-oidc`: OAuth utilities

### Dev Dependencies
- Standard build/test tooling (see Tech Stack)
- No additional linting tools needed (oxlint handles everything except spellcheck)

## Contact

- **Author**: baxyz <baxy@etik.com>
- **Repository**: https://github.com/helpers4/helpers4
- **License**: AGPL-3.0
