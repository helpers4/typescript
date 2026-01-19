# Coherency Tests

This directory contains scripts for validating the coherency and integrity of the project structure, packages, and dependencies.

## Overview

Coherency tests ensure that:

- Build outputs are correct and complete
- Package versions are consistent across all packages
- Dependencies are properly configured
- Package structures follow expected patterns
- Bundle sizes are within expected ranges

## Architecture

The coherency tests are organized in a modular structure with dedicated subdirectories:

```tree
scripts/coherency/
├── index.ts                    # Main orchestrator (runs all tests in parallel)
├── README.md                   # This documentation
├── bundle/
│   └── index.ts               # Bundle package integrity test
├── version/
│   ├── index.ts               # Version consistency test
│   └── helper.ts              # Version validation logic
├── category/
│   ├── index.ts               # Category packages validation test
│   └── helper.ts              # Category validation logic
├── dependencies/
│   ├── index.ts               # Dependencies coherency test
│   └── helper.ts              # Dependencies validation logic
└── sizes/
    ├── index.ts               # Bundle size analysis test
    └── helper.ts              # Size calculation logic
```

## Scripts

### Main Orchestrator

#### `index.ts`

Main coherency test runner that executes all validation tests in parallel for optimal performance.

**Usage:**

```bash
# Run all coherency tests in parallel
npm run coherency

# Or directly with tsx
npx tsx scripts/coherency/
```

### Individual Test Modules

#### `bundle/index.ts` - Bundle Package Integrity

Tests the main bundle package integrity and completeness.

**Validations:**

- ✅ All required files exist
- ✅ Package.json is valid
- ✅ Dependencies are correct
- ✅ Metadata is consistent

**Usage:**

```bash
npm run coherency:bundle
```

#### `version/` - Version Consistency

Ensures all packages have consistent version numbers across the project.

**Structure:**

- `index.ts` - Test execution
- `helper.ts` - Version validation logic

**Verification:**

- Root package version matches build packages
- All category packages use same version
- Bundle package version is consistent
- No version mismatches

**Usage:**

```bash
npm run coherency:version
```

#### `category/` - Category Package Validation

Validates all category packages (array, string, object, etc.) for structural consistency.

**Structure:**

- `index.ts` - Test execution
- `helper.ts` - Category validation logic

**Verification:**

- Package structure consistency
- Export file validity
- Dependency coherency
- Configuration compliance

**Usage:**

```bash
npm run coherency:category
```

#### `dependencies/` - Dependencies Coherency

Verifies dependencies consistency across all packages.

**Structure:**

- `index.ts` - Test execution
- `helper.ts` - Dependencies validation logic

**Verification:**

- External dependencies versions match
- Internal dependencies are properly configured
- No circular dependencies
- Version consistency across packages

**Usage:**

```bash
npm run coherency:dependencies
```

#### `sizes/` - Bundle Size Analysis

Analyzes bundle sizes and provides insights into package sizes and structure.

**Structure:**

- `index.ts` - Test execution
- `helper.ts` - Size calculation and analysis logic

**Analysis:**

- Individual package sizes
- Bundle composition analysis
- Size trend monitoring
- Performance impact assessment

**Usage:**

```bash
npm run coherency:sizes
```

## Integration

Coherency tests are integrated with:

- **Build process**: Validates build output integrity
- **Release process**: Pre-release validation ensures consistency
- **CI/CD**: Automated testing in GitHub Actions workflows
- **Publishing**: Pre-publish validation prevents inconsistent releases

## Package.json Commands

The following commands are available for running coherency tests:

```bash
# Run all tests in parallel (recommended)
npm run coherency

# Run individual tests
npm run coherency:bundle        # Bundle integrity test
npm run coherency:version       # Version consistency test
npm run coherency:category      # Category packages validation
npm run coherency:dependencies  # Dependencies coherency test
npm run coherency:sizes         # Bundle size analysis
```

## Usage in CI/CD

GitHub Actions integration with the run-verification composite action:

```yaml
# In GitHub Actions workflow
- name: Run Coherency Tests
  uses: ./.github/actions/run-verification
  with:
    artifact-name: ARTIFACT_BUILD
```

Or run directly:

```yaml
- name: Run Coherency Tests
  run: npm run coherency
```

## Test Output

Tests provide detailed feedback including:

- ✅ **Passed validations** with detailed success messages
- ❌ **Failed validations** with specific error messages and resolution guidance
- 📊 **Summary statistics** showing overall test results
- 🔍 **Detailed information** about discovered issues and inconsistencies
- ⚡ **Parallel execution** for faster completion times

## Performance Features

- **Parallel execution**: All tests run concurrently for optimal performance
- **Modular architecture**: Individual tests can be run independently
- **Helper separation**: Business logic separated from test execution
- **Caching support**: Build artifacts reused across test runs
- **Optimized output**: Clean, actionable feedback with visual indicators

## Development

### Adding New Tests

To add a new coherency test:

1. Create a new subdirectory in `scripts/coherency/`
2. Add `index.ts` for test execution
3. Add `helper.ts` for business logic (if needed)
4. Update the main `index.ts` orchestrator
5. Add a npm script command in `package.json`

### Test Structure Template

```typescript
// my-test/index.ts
import { runMyTest } from './helper.js';

async function main() {
  console.log('🔍 Running My Test...');
  
  try {
    const result = await runMyTest();
    console.log('✅ My Test passed');
    console.log(result);
  } catch (error) {
    console.error('❌ My Test failed');
    console.error(error.message);
    process.exit(1);
  }
}

main();
```

## Related Documentation

- **[../README.md](../README.md)** - Main scripts documentation
- **[../build/README.md](../build/README.md)** - Build system that generates validated output
- **[../version/README.md](../version/README.md)** - Version management using coherency tests
- **[../publish/README.md](../publish/README.md)** - Publishing system with pre-publish validation
