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

- Failed publishes never trigger automatic rollback — npm has no safe undo for a publish
  (`npm unpublish` permanently bans republishing that exact version; `npm deprecate` needs a
  classic auth token this pipeline's OIDC/provenance publish flow doesn't have, so it 404s)
- Packages that published successfully before the failure stay live; the run reports them
  clearly so you know what's already out
- To recover, fix the underlying failure and re-run at the same version — already-published
  packages are skipped automatically. Never bump/revert the version to retry: npm refuses to
  ever republish a version it has seen before, even if it was later unpublished

### `unpublish-version.ts`

Best-effort cleanup script for a release that failed partway through — unpublishes one
specific version across every category package and the `@helpers4/all` bundle, skipping any
package that was never published at that version and logging (never stopping on) any package
that fails to unpublish.

#### Usage

```bash
# Unpublish 3.0.8 everywhere it was published
pnpm run unpublish:version 3.0.8

# See what would happen without doing it
pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8 --dry-run

# Pass a one-time password up front instead of answering the npm prompt interactively
pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8 --otp 123456
```

#### Options

- `--version <version>` : version to unpublish (also accepted as a bare positional argument)
- `--registry <url>` : custom NPM registry
- `--otp <code>` : one-time password, passed to every `npm unpublish` call
- `--dry-run` : print what would be unpublished without doing it

#### 2FA

`npm unpublish` runs with inherited stdio (not silently captured like `index.ts`'s publish
calls), so if the npm account has 2FA enabled, npm's own "Enter OTP:" prompt appears directly
in the terminal for each package that needs it — answer it exactly as you would for a manual
`npm unpublish`. Pass `--otp` to skip the prompt when a valid code is already on hand.

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

Tracks a publishing run and reports (never rolls back) what happened on failure:
- Records each successful publish
- State tracking
- Honest failure reporting — lists packages already live, no npm calls

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
