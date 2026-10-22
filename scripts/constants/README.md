# Constants

This directory contains shared constants used across all build, publish, and validation scripts.

## Files

### `build.constant.ts`

Build-related constants including:

- **BUNDLE_NAME** : Name of the main bundle package
- **BUILD_DIRECTORIES** : Output directory configurations
- **FILE_PATTERNS** : File matching patterns for build process

### `dir.constant.ts`

Directory path constants:

- **ROOT_DIR** : Project root directory
- **HELPERS_DIR** : Source code directory
- **BUILD_DIR** : Build output directory
- **TEMPLATE_DIR** : Template files directory

### `files.constant.ts`

File name and pattern constants:

- **CONFIG_FILES** : Configuration file names
- **STATIC_FILES** : Files to copy during build
- **TEMPLATE_FILES** : Template file patterns

### `index.ts`

Central export point for all constants, providing a single import location for other scripts.

## Usage

```typescript
import { DIR, BUILD, FILES } from '../constants';

// Use directory constants
const sourcePath = DIR.HELPERS;
const outputPath = DIR.BUILD;

// Use build constants
const bundleName = BUILD.BUNDLE_NAME;

// Use file constants
const configFile = FILES.PACKAGE_JSON;
```

## Benefits

- **Centralization** : All constants in one location
- **Consistency** : Same values used across all scripts
- **Maintainability** : Easy to update paths and configurations
- **Type Safety** : TypeScript definitions for all constants
