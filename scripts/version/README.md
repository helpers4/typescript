# Version Management

This directory contains scripts for managing versions and releases in the helpers4 project.

## Scripts

### `version-manager.ts`

Manages version bumps for the project and all packages.

#### Usage

```bash
# Automatic version calculation from git commits
pnpm run version:auto

# Manual version types
pnpm run version:patch      # 2.0.0-alpha.0 → 2.0.0
pnpm run version:minor      # 2.0.0 → 2.1.0
pnpm run version:major      # 2.0.0 → 3.0.0
pnpm run version:prerelease # 2.0.0 → 2.0.1-alpha.0

# Or directly with tsx
pnpm exec tsx scripts/version/version-manager.ts --auto
```

#### Options

- `--auto` : Auto-calculate version from conventional commits
- `--dry-run` : Preview changes without applying them
- `--no-build` : Update only root package (skip build packages)
- `--root <path>` : Custom root directory

#### Conventional Commit Analysis

- `feat: new feature` → **minor** version bump
- `fix: bug fix` → **patch** version bump
- `feat!: breaking change` or `BREAKING CHANGE:` → **major** version bump
- Other commits → **patch** version bump

### `release.ts`

Complete release process including testing, building, and publishing.

#### Usage

```bash
# Full release process
pnpm run release:patch
pnpm run release:minor
pnpm run release:major
pnpm run release:prerelease

# Auto-detect version and release
pnpm exec tsx scripts/version/release.ts --auto

# Dry run
pnpm run release:dry-run
```

#### Options

- `--skip-tests` : Skip test execution
- `--skip-build` : Skip build process
- `--branch <name>` : Specify git branch
- `--dry-run` : Preview without making changes

#### Release Process

1. **Validation** : Pre-release checks
2. **Testing** : Run all unit tests
3. **Version Update** : Bump version numbers
4. **Building** : Build all packages
5. **Coherency Tests** : Validate package integrity
6. **Git Operations** : Create commit and tag
7. **Publishing** : Publish to NPM registry

### `pre-release-validator.ts`

Validates project state before release.

#### Checks

- Git working directory is clean
- All required scripts exist
- No uncommitted changes
- Branch is up-to-date

### `commit-analyzer.ts`

Analyzes git commits to determine appropriate version bump using conventional commits.

### `git-utils.ts`

Git utilities for version management and release operations.

## Integration

These scripts are integrated with:

- **Package.json scripts** : `version:*` and `release:*` commands
- **GitHub Actions** : Automated releases via workflows
- **Build system** : Coordinated with build and publish scripts

## Prerelease Handling

- If current version is `2.0.0-alpha.5`, prerelease becomes `2.0.0-alpha.6`
- If current version is `2.0.0`, prerelease becomes `2.0.1-alpha.0`

## Related Documentation

- **[../README.md](../README.md)** - Main scripts documentation
- **[../publish/README.md](../publish/README.md)** - Publishing system used in release process
- **[../coherency/README.md](../coherency/README.md)** - Coherency tests run during release
- **[../build/README.md](../build/README.md)** - Build system used in release process
