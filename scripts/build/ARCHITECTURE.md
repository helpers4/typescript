# Build System Architecture

## New Architecture

The build system has been refactored for better organization and maintainability.

### File Structure

```
scripts/
├── build/
│   ├── index.ts                       # Main build orchestrator (simplified)
│   ├── build-categories.ts            # Build all individual categories
│   ├── build-bundle.ts                # Build the bundle package  
│   └── helpers/
│       ├── index.ts                   # Export all helpers
│       ├── compile-type-script.helper.ts
│       ├── copy-static-*.ts           # Static file copying
│       ├── create-*.ts                # File generation helpers
│       ├── prepare-*.ts               # Package preparation helpers
│       └── get-external-dependencies.helper.ts
└── coherency/
    ├── index.ts                       # Coherency tests runner
    └── test-bundle.ts                 # Bundle validation tests
```

### Key Changes

1. **Build Algorithms at Top Level**: 
   - `build-categories.ts` and `build-bundle.ts` moved to `scripts/build/`
   - Direct access to main build logic
   - Clear separation between algorithms and helpers

2. **Coherency Tests Separated**:
   - `test-bundle.ts` moved to `scripts/coherency/`
   - Dedicated folder for all CI validation tests
   - Extensible for future coherency checks

3. **Clear Separation of Concerns**:
   - **Build algorithms**: Main logic for building packages
   - **Helpers**: Utility functions for specific tasks
   - **Coherency**: Validation and testing

### Usage

```bash
# Build everything
npm run build

# Test bundle coherency
npm run coherency:bundle

# Run all coherency tests
npm run coherency
```

### Benefits

- **Algorithm visibility**: Main build logic is easily accessible
- **Better organization**: Algorithms, helpers, and tests are clearly separated
- **Extensible coherency**: Easy to add more validation tests
- **Maintainable**: Each component has a specific role and location
