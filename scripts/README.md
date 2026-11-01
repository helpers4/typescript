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

### 🧬 `mutation/`

Mutation testing support scripts

- **merge-shards.ts** : Combines sharded mutation-dashboard.yml runs into one project-wide report

### 🚀 `publish/`

Package maintenance (the release itself is `.github/workflows/release.yml`, see [RELEASE.md](RELEASE.md))

- **unpublish-version.ts** : Unpublish a version
- **helpers/** : npm utilities

### 🧪 `tests/`

Test utility scripts

- **preload.ts** : Test preload configuration

## Quick Start

```bash
# Build all packages
pnpm run build

# Run coherency tests
pnpm run coherency

```

## Documentation

Each subdirectory contains its own README.md with detailed documentation for its specific scripts and utilities:

- **[build/README.md](build/README.md)** - Build system and package generation
- **[coherency/README.md](coherency/README.md)** - Coherency testing and validation
- **[constants/README.md](constants/README.md)** - Shared constants documentation
- **[license/README.md](license/README.md)** - License management tools
- **[RELEASE.md](RELEASE.md)** - Releasing
- **[tests/README.md](tests/README.md)** - Test utilities and configuration
