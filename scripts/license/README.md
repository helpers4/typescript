# License Management

This directory contains scripts for managing license headers and compliance across the project.

## Scripts

### `add-license-headers.ts`

Automatically adds or updates license headers in TypeScript files.

#### Usage

```bash
# Add license headers to all TypeScript files
pnpm run license:add

# Or directly with tsx
pnpm exec tsx scripts/license/add-license-headers.ts
```

#### Features

- **Automatic Detection** : Scans all TypeScript files in the project
- **Header Management** : Adds missing headers or updates existing ones
- **Format Consistency** : Ensures consistent license header format
- **File Patterns** : Configurable file inclusion/exclusion patterns

#### Scope

The script processes files in:
- `helpers/**/*.ts` : Source code files
- `scripts/**/*.ts` : Build and automation scripts
- Other TypeScript files as configured

#### License Header Format

```typescript
/**
 * @license
 * Copyright (c) 2024 helpers4
 * SPDX-License-Identifier: MIT
 */
```

#### Configuration

License header content and file patterns can be configured within the script to match project requirements.

## Integration

- **Build Process** : Can be run as part of the build pipeline
- **Pre-commit Hooks** : Ensures license compliance before commits
- **CI/CD** : Validates license headers in automated workflows

## Legal Compliance

This tool helps maintain:
- **License Consistency** : All files have proper license headers
- **Legal Requirements** : Meets open source license obligations
- **Attribution** : Proper copyright attribution in all files
