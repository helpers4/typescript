# Scripts

This directory contains all project automation and tooling scripts, organized by theme.

## Structure

### 📦 `build/`

Build and package generation scripts

- **build-bundle.ts** : Main bundle construction
- **build-categories.ts** : Individual category package construction
- **helpers/** : Build process utilities

### 🔗 `coherency/`

Project coherency validation scripts

- **test-bundle.ts** : Bundle coherency tests
- **test-category-packages.ts** : Category package validation
- **test-dependencies-coherency.ts** : Dependencies coherency verification
- **test-version-consistency.ts** : Version consistency validation

### 📋 `constants/`

Shared constants between scripts

- **build.constant.ts** : Build constants
- **dir.constant.ts** : Directory path constants
- **files.constant.ts** : File constants

### 📄 `license/`

License management

- **add-license-headers.ts** : Automatic license header addition

### 🚀 `publish/`

Package publishing scripts

- **helpers/** : Publishing utilities (npm, package discovery, transaction management)

### 🧪 `tests/`

Test utility scripts

- **preload.ts** : Test preload configuration

### 🏷️ `version/`

Version and release management

- **commit-analyzer.ts** : Commit analysis for versioning
- **git-utils.ts** : Git utilities
- **pre-release-validator.ts** : Pre-release validation
- **release.ts** : Release process
- **version-manager.ts** : Version management

## Quick Start

```bash
# Build all packages
pnpm run build

# Run coherency tests
pnpm run coherency

# Version bump (patch/minor/major/prerelease)
pnpm run version:patch

# Auto-detect version from commits
pnpm run version:auto

# Publish packages
pnpm run publish

# Dry run publish
pnpm run publish:dry-run
```

## Documentation

Each subdirectory contains its own README.md with detailed documentation for its specific scripts and utilities:

- **[build/README.md](build/README.md)** - Build system and package generation
- **[coherency/README.md](coherency/README.md)** - Coherency testing and validation
- **[constants/README.md](constants/README.md)** - Shared constants documentation
- **[license/README.md](license/README.md)** - License management tools
- **[publish/README.md](publish/README.md)** - Publishing system with transaction safety
- **[tests/README.md](tests/README.md)** - Test utilities and configuration
- **[version/README.md](version/README.md)** - Version management and release automation
