# Release Process Documentation

This document describes the automated release process for helpers4.

## Overview

The release process is automated through GitHub Actions and includes:
1. **Testing** - Runs all unit tests
2. **Version Update** - Increments version numbers
3. **Building** - Builds all packages
4. **Coherency Tests** - Validates package integrity
5. **Git Operations** - Creates commit and tag
6. **Publishing** - Publishes to NPM registry

## Release Types

### Version Types
- **patch**: Bug fixes (1.0.0 → 1.0.1)
- **minor**: New features (1.0.0 → 1.1.0) 
- **major**: Breaking changes (1.0.0 → 2.0.0)
- **prerelease**: Alpha/Beta versions (1.0.0 → 1.0.1-alpha.0)

### Prerelease Handling
- If current version is `2.0.0-alpha.5`, prerelease becomes `2.0.0-alpha.6`
- If current version is `2.0.0`, prerelease becomes `2.0.1-alpha.0`

## Manual Release (Local)

### Prerequisites
```bash
# Ensure you have the latest changes
git pull origin main

# Ensure dependencies are installed
pnpm install

# Ensure working directory is clean
git status
```

### Release Commands
```bash
# Dry run (recommended first)
pnpm run release:dry-run

# Patch release
pnpm run release:patch

# Minor release  
pnpm run release:minor

# Major release
pnpm run release:major

# Prerelease (alpha/beta)
pnpm run release:prerelease
```

### Advanced Options
```bash
# Skip specific steps
pnpm exec tsx scripts/version/release.ts patch --skip-tests --skip-build

# Target specific branch
pnpm exec tsx scripts/version/release.ts minor --branch develop

# Full dry run
pnpm exec tsx scripts/version/release.ts major --dry-run
```

## GitHub Actions Release

### Triggering a Release
1. Go to **Actions** tab in GitHub repository
2. Select **Release** workflow
3. Click **Run workflow**
4. Choose:
   - **Version type**: patch/minor/major/prerelease
   - **Target branch**: usually 'main'
5. Click **Run workflow**

### What Happens
1. **Checkout & Setup**: Gets code and sets up Node.js
2. **Tests**: Runs `pnpm test`
3. **Version Update**: Updates package.json versions
4. **Build**: Runs `pnpm run build` 
5. **Coherency**: Runs coherency tests
6. **Git Operations**: Creates commit and tag, pushes to repository
7. **NPM Publish**: Publishes all packages to NPM registry
8. **GitHub Release**: Creates GitHub release with notes

### Package Publication Order
1. **Category packages** (array, string, url, etc.) - published first
2. **Wait 60 seconds** - allows NPM registry to process
3. **Bundle package** (all) - published last

### Transaction Safety
- If any category package fails to publish, the process stops
- Failed packages are automatically deprecated to maintain registry consistency
- Bundle package only publishes if all category packages succeed

## Coherency Tests

The coherency testing system validates:

### Bundle Package Test
- Verifies main bundle package structure
- Checks required files exist
- Validates package.json metadata

### Version Consistency Test  
- Ensures all packages have matching versions
- Compares root package.json with build packages
- Reports any version mismatches

### Category Packages Test
- Validates each category package structure
- Checks for required files (package.json, README.md, LICENSE.md)
- Verifies lib directory contains built files
- Ensures proper package.json structure

### Dependencies Coherency Test
- Compares dependency versions across packages
- Validates license and repository fields
- Reports version mismatches with warnings

## Troubleshooting

### Common Issues

**Working Directory Not Clean**
```bash
git status
git add . && git commit -m "prep for release"
# or
git stash
```

**Version Update Fails**
- Check package.json syntax
- Ensure no file locks on package.json

**Build Fails**
- Run `pnpm run build` locally to debug
- Check for TypeScript errors

**Coherency Tests Fail**
- Run `pnpm run coherency` locally
- Review specific test failures

**NPM Publish Fails**
- Verify NPM_TOKEN secret is set
- Check NPM registry status
- Ensure package names are available

### Recovery Commands

**Revert Version Changes**
```bash
git checkout HEAD -- package.json
git reset --hard HEAD~1  # if commit was made
```

**Remove Created Tag**
```bash
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3  # if pushed
```

**Deprecate Failed Package**
```bash
npm deprecate @helpers4/package@1.2.3 "Release failed"
```

## File Structure

```
scripts/
├── version/
│   ├── version-manager.ts    # Version increment logic
│   ├── git-utils.ts         # Git operations
│   ├── release.ts           # Main release orchestrator
│   └── index.ts            # Exports
├── coherency/
│   ├── index.ts                       # Test runner
│   ├── test-bundle.ts                 # Bundle tests  
│   ├── test-version-consistency.ts    # Version tests
│   ├── test-category-packages.ts      # Category tests
│   └── test-dependencies-coherency.ts # Dependency tests
├── build/                   # Build scripts
└── publish/                 # Publish scripts

.github/workflows/
└── release.yml             # GitHub Actions workflow
```

## Security Notes

- **NPM_TOKEN**: Store as GitHub repository secret
- **GITHUB_TOKEN**: Automatically provided by GitHub Actions
- All operations use secure token authentication
- No sensitive data is logged or exposed
