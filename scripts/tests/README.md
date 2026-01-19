# Test Utilities

This directory contains utility scripts and configurations for testing.

## Files

### Configuration

Test configuration is handled by Vitest through `vitest.config.ts` in the project root.

#### Purpose

The Vitest configuration:
- Sets up global test environment
- Configures test utilities (happy-dom)
- Includes test file patterns
- Provides common test helpers through globals

#### Configuration

Referenced in `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts'],
  },
});
```

#### Integration

- **Vitest Test Runner** : Modern test framework with fast execution
- **Global Setup** : Provides consistent test environment with globals enabled
- **Helper Functions** : Common utilities from vitest available to all tests

## Usage

Run tests using npm scripts:

```bash
# Run tests
npm test

# Run specific test files
npm test -- helpers/array/

# Run tests in watch mode
npm run test:watch
```

## Benefits

- **Consistency** : Same setup across all tests
- **DRY Principle** : Avoid repeating setup code in individual tests
- **Performance** : Fast parallel execution with Vitest
- **Global Access** : Test utilities (describe, it, expect) available everywhere
