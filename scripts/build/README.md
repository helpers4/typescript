# Build Scripts

This directory contains scripts for building and generating packages from the source code.

## Scripts

### `index.ts`

Main build orchestrator that coordinates the entire build process.

#### Usage

```bash
# Build all packages
npm run build

# Or directly with tsx
npx tsx scripts/build/
```

### `build-categories.ts`

Builds individual category packages (array, string, object, etc.).

#### Features

- TypeScript compilation
- Package.json generation
- README generation
- License file copying
- Index file creation

### `build-bundle.ts`

Builds the main bundle package that aggregates all categories.

#### Features

- Dependency aggregation
- Metadata generation
- Package configuration
- Bundle documentation

## Helpers

### `helpers/compile-type-script.helper.ts`

TypeScript compilation utilities:
- Source compilation
- Type definition generation
- Error handling

### `helpers/create-index-file.helper.ts`

Generates index.ts files for package exports.

### `helpers/prepare-category-package-json.ts`

Creates package.json files for category packages with:
- Proper dependencies
- Correct metadata
- Export configurations

### `helpers/prepare-bundle-package-json.ts`

Creates package.json for the bundle package with:
- All category dependencies
- Aggregated metadata
- Bundle-specific configuration

### `helpers/copy-static-files.ts`

Copies static files (README, LICENSE) to build output.

### `helpers/get-external-dependencies.helper.ts`

Analyzes and extracts external dependencies from source code.

### `helpers/create-bundle-metadata.ts`

Generates metadata for the bundle package including:
- Build timestamps
- Package versions
- Category information

## Build Output

The build process generates:

```
build/
├── array/          # Category package
│   ├── lib/        # Compiled JS/TS
│   ├── package.json
│   ├── README.md
│   └── LICENSE.md
├── string/         # Category package
└── all/            # Bundle package
    ├── meta/       # Metadata files
    ├── package.json
    ├── README.md
    └── LICENSE.md
```

## Configuration

Each category has a `config.json` file that defines:
- Package metadata
- Dependencies
- Export configuration
- Build settings

## Integration

The build system integrates with:
- **Source code** : Compiles from `helpers/` directory
- **Configuration** : Uses category `config.json` files
- **Templates** : Uses `.template/` directory for static files
- **Publishing** : Generates packages for publication
- **Coherency tests** : Validates build output

## Architecture

See `ARCHITECTURE.md` for detailed information about the build system design and structure.

## Related Documentation

- **[../README.md](../README.md)** - Main scripts documentation
- **[../coherency/README.md](../coherency/README.md)** - Validation of build output
- **[../publish/README.md](../publish/README.md)** - Publishing system for build artifacts
- **[../constants/README.md](../constants/README.md)** - Constants used in build process
