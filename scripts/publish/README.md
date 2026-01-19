# Publishing Scripts

This directory contains scripts for publishing packages to NPM registry with transaction safety and validation.

## Scripts

### `index.ts`

Main publishing script with comprehensive features.

#### Usage

```bash
# Publish all packages
pnpm run publish:packages

# Test publishing without actually publishing
pnpm run publish:dry-run

# Custom configuration (direct execution)
pnpm exec tsx scripts/publish/index.ts --dry-run --access public --tag beta --category-delay 30
```

#### Features

- **Transactional Publishing** : Automatic rollback on failure
- **Smart Package Discovery** : Automatic detection of categories and bundles
- **Validation System** : Pre-publish package structure validation
- **Retry Logic** : Automatic retries with exponential backoff
- **Order Management** : Categories published before bundles

#### Options

- `--dry-run` : Test without actually publishing
- `--access <public|restricted>` : Package access level
- `--tag <tag>` : NPM dist-tag (default: latest)
- `--category-delay <seconds>` : Delay between category and bundle publishing (default: 60)
- `--skip-validation` : Skip pre-publish validation
- `--retries <number>` : Max retry attempts (default: 3)
- `--retry-delay <seconds>` : Delay between retries (default: 5)
- `--verbose` : Detailed logging
- `--build-dir <path>` : Custom build directory
- `--registry <url>` : Custom NPM registry

#### Publishing Strategy

1. **Phase 1** : Category packages (`@helpers4/array`, `@helpers4/string`, etc.)
2. **Wait** : Configurable delay for NPM registry propagation
3. **Phase 2** : Bundle packages (`@helpers4/all`)

#### Transaction Safety

- Failed publishes trigger automatic rollback
- Published packages are deprecated with clear messages
- No partial states left in registry

## Helpers

### `helpers/npm-utils.ts`

NPM registry utilities including:
- Package publication
- Version checking
- Deprecation management
- Registry communication

### `helpers/package-discovery.ts`

Package discovery and categorization:
- Automatic detection of category packages
- Bundle package identification
- Build directory scanning

### `helpers/transaction-manager.ts`

Transaction management for safe publishing:
- Rollback mechanisms
- State tracking
- Error recovery

## Integration

The publishing system integrates with:
- **Version management** : Coordinated releases
- **Build system** : Published from build output
- **GitHub Actions** : Automated publishing workflows
- **Coherency tests** : Pre-publish validation

## Examples

```bash
# Standard release publishing
pnpm run publish:packages

# Beta release with custom tag
pnpm exec tsx scripts/publish/index.ts --tag beta --access public

# Custom registry
pnpm exec tsx scripts/publish/index.ts --registry https://custom-registry.com

# Quick publish with minimal validation
pnpm exec tsx scripts/publish/index.ts --skip-validation --category-delay 10
```

## Related Documentation

- **[../README.md](../README.md)** - Main scripts documentation
- **[../version/README.md](../version/README.md)** - Version management system
- **[../build/README.md](../build/README.md)** - Build system that generates publishable packages
- **[../coherency/README.md](../coherency/README.md)** - Pre-publish validation tests
