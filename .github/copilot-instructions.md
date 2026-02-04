# GitHub Copilot Instructions

This file provides instructions for GitHub Copilot when working on this repository.

## Project Context

See [AGENTS.md](../AGENTS.md) for detailed project guidelines and coding conventions.

## Model Restrictions

> **⚠️ IMPORTANT**: Do not use GPT models for this project.
>
> Preferred models: **Claude** (claude-sonnet-4, Claude Opus 4.5)
>
> This restriction exists because GPT models have shown inconsistent behavior with this codebase's
> coding conventions and TypeScript strict mode requirements.

## Model Configuration for Organization Administrators

To enforce model restrictions at the organization level:

1. Go to **Organization Settings** > **Copilot** > **Models**
2. Disable GPT models if not desired
3. Enable only the preferred models (Claude, etc.)

See [GitHub Documentation](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-policies-for-copilot-in-your-organization) for details.

## Key Guidelines

### Code Style

- TypeScript strict mode is mandatory
- **The `any` type is strictly forbidden** - use `unknown` or specific types
- Use single quotes for strings
- 2-space indentation
- No semicolons

### File Headers

Every source file must include:

```typescript
/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
```

### Testing

- Use Vitest for all tests
- Colocate tests with source files (`*.test.ts` or `*.spec.ts`)
- Aim for comprehensive test coverage

### Commit Messages

Follow Conventional Commits with emojis:

- `feat`: ✨ New feature
- `fix`: 🐛 Bug fix
- `refactor`: ♻️ Code refactoring
- `docs`: 📚 Documentation
- `test`: 🧪 Tests
- `chore`: 🔧 Maintenance
- `ci`: 🏗️ CI/CD changes
