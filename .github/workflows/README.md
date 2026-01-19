# GitHub Workflows

This directory contains GitHub Actions workflows for the helpers4 project.

## Available Workflows

### 🚀 Release Workflow (`release.yml`)

**Purpose**: Automates the complete release process including testing, building, version management, and publishing.

**Trigger**: Manual workflow dispatch

**Inputs**:
- `version_type`: Type of version bump (patch/minor/major/prerelease)
- `branch`: Target branch (default: main)

**Process**:
1. **Setup**: Checkout code and install dependencies with Node.js
2. **Test**: Run all unit tests with Vitest
3. **Version**: Update version in package.json (handles alpha/beta increments)
4. **Build**: Build all packages with Vite
5. **Coherency**: Run integrity tests on built packages
6. **Commit**: Create version commit and push to repository
7. **Tag**: Create and push git tag
8. **Publish**: Publish packages to NPM (categories first, then bundle)
9. **Release**: Create GitHub release with automated notes

**Features**:
- 🔒 **Transaction Safety**: Failed publishes trigger rollback
- 📦 **Order Management**: Categories published before bundle
- ⏳ **Delay Handling**: 60s wait between category and bundle publishing
- 🔄 **Retry Logic**: Up to 3 attempts per package with 30s delays
- 📊 **Detailed Logging**: Comprehensive status reporting

**Required Secrets**:
- `NPM_TOKEN`: NPM authentication token with publish permissions
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

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
   - Select version type and target branch
   - Click "Run workflow"

### Version Type Guidelines

- **patch**: Bug fixes and small improvements
- **minor**: New features (backward compatible)
- **major**: Breaking changes
- **prerelease**: Alpha/beta releases for testing

### Example Release Flow

```
Current: 2.0.0-alpha.0
├── patch → 2.0.0
├── minor → 2.1.0  
├── major → 3.0.0
└── prerelease → 2.0.0-alpha.1

Current: 2.0.0
├── patch → 2.0.1
├── minor → 2.1.0
├── major → 3.0.0  
└── prerelease → 2.0.1-alpha.0
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
- NPM authentication uses secure tokens
- Git operations use GitHub's provided token
