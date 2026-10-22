# GitHub Workflows

This directory contains GitHub Actions workflows for the helpers4 project.

## Available Workflows

### 🚀 Release Workflow (`release.yml`)

**Purpose**: Automates the complete release process including testing, building, version management, and publishing.

**Trigger**: Manual workflow dispatch

**Inputs**:

- `release_type`: `patch` / `minor` / `major` (stable, main only) · `alpha` / `beta` / `rc`
  (prerelease, any branch) · `auto` (stable, version inferred from commits) · `resume`
  (retries the current version with no bump — for finishing a release that already published
  some packages and failed on others)
- `dry-run`: Perform a dry-run — no git push, no npm publish (default: false)

**Jobs**:

1. **repo-guard**: Confirms this is `helpers4/typescript`, and that stable release types only
   run from `main` (prereleases may run from any branch)
2. **lint** / **type-check** / **tests** / **security**: Run in parallel; `tests` enforces the
   100% coverage gate
3. **build-and-verify**: Bumps the version (`pnpm version:*`, or the prerelease/auto helper
   scripts), injects `@since` tags for stable releases, builds all packages, runs coherency
   checks, and uploads the result as artifacts for the next job
4. **publish**: Downloads those artifacts, generates the changelog, commits the version bump,
   publishes to npm (categories, then the bundle), creates a verified git tag and GitHub
   Release, and attests build provenance
5. **trigger-website-docs**: Notifies the `website` repo to refresh its generated docs (skipped
   on dry-run)

**Features**:

- 🔒 **Resumable**: `resume` re-publishes only what didn't make it the first time, at the same
  version — `publish:packages` skips anything already on the registry
- 📦 **Order Management**: Categories published before the bundle
- 📊 **Provenance**: SLSA build attestation, re-uploaded as an `.intoto.jsonl` release asset for
  OpenSSF Scorecard's Signed-Releases check

**Authentication**:

- A GitHub App token (not the default `GITHUB_TOKEN`) handles the version-commit push, tag, and
  release creation, so they show up as verified and can trigger downstream workflows
- npm publish uses OIDC provenance (no npm token required); `id-token: write` enables it

### Other entry-point workflows

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `pr-validation.yml` | `pull_request` | Build/test/lint/type-check/security on every PR, plus mutation testing scoped to changed files |
| `main-validation.yml` | `push` to `main` | The same suite against `main` post-merge, feeding Codecov |
| `mutation-dashboard.yml` | `push` to `main` | Full-project mutation run, refreshing the incremental baseline and the Stryker dashboard |
| `post-release.yml` | Triggered by `release.yml` | Post-release follow-up steps |
| `scorecard.yml` | Scheduled | OpenSSF Scorecard analysis |
| `auto-assign.yml` | `pull_request` | Auto-assigns PR authors/reviewers |

The `job-*.yml` files are reusable building blocks (`workflow_call`) shared across the
workflows above — they aren't triggered directly.

## Usage

### Running a Release

1. **Navigate to Actions**:
   - Go to your repository on GitHub
   - Click the "Actions" tab

2. **Select Release Workflow**:
   - Find "Release" in the workflow list
   - Click on it

3. **Run Workflow**:
   - Click "Run workflow" button
   - Select a release type (and the branch to run from, for prerelease types)
   - Click "Run workflow"

### Release Type Guidelines

- **patch** / **minor** / **major**: Stable releases — main only
- **auto**: Stable release, version bump inferred from commits since the last release — main only
- **alpha** / **beta** / **rc**: Prerelease — any branch
- **resume**: Retries the current version with no bump, to finish a release that already
  published some packages and failed on others — main only

### Example Release Flow

```text
Current: 2.0.0-alpha.0
├── patch → 2.0.0
├── minor → 2.1.0
├── major → 3.0.0
└── alpha → 2.0.0-alpha.1

Current: 2.0.0
├── patch → 2.0.1
├── minor → 2.1.0
├── major → 3.0.0
└── alpha → 2.0.1-alpha.0
```

## Monitoring

### Workflow Status

- ✅ Green: All steps completed successfully
- 🟡 Yellow: In progress
- ❌ Red: Failed - check logs for details

### Common Failure Points

1. **Tests**: Unit tests failing
2. **Build**: TypeScript compilation errors
3. **Coherency**: Package integrity issues
4. **Publish**: NPM registry issues or authentication

### Troubleshooting

- Check workflow logs for detailed error messages
- Review the release documentation in `scripts/version/README.md`
- Run processes locally first to debug issues

## Security

- All tokens are stored as GitHub Secrets
- No sensitive data is logged
- npm publish uses OIDC provenance — no long-lived npm token stored
- Git operations (version-commit push, tag, release) use a short-lived GitHub App token, not the
  default `GITHUB_TOKEN`
