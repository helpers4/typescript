# @helpers4/presets

Shared tool presets of helpers4 projects. Install it as a dev dependency and extend it from each tool's
own configuration; local settings always win.

```bash
pnpm add -D @helpers4/presets
```

The same files are reachable from the unified package as `helpers4/presets/…`.

## TypeScript

Pick `lib.json` (published library: declarations) or `app.json` (application: DOM, JSX, `noEmit`). Both
extend `base.json` (strict, unused code reported, bundler resolution).

```jsonc
// tsconfig.json
{
  "extends": "@helpers4/presets/tsconfig/lib.json",
  "include": ["src"]
}
```

## oxlint

`strict.json` is the configuration of helpers4/typescript. `app.json` adds the Vitest and accessibility
plugins and reports `perf` as warnings. Both forbid `any` outside test files.

```jsonc
// .oxlintrc.json
{
  "extends": ["./node_modules/@helpers4/presets/oxlint/strict.json"]
}
```

## oxfmt

```bash
oxfmt -c node_modules/@helpers4/presets/oxfmt.json
```

## Vitest

File lists are options, not something to merge: `mergeConfig` concatenates arrays.

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestConfig } from '@helpers4/presets/vitest';

export default mergeConfig(
  vitestConfig({ coverage: 100, include: ['src/**/*.test.ts'] }),
  defineConfig({ test: { globals: false } })
);
```

## Stryker

```js
// stryker.config.mjs
import { strykerConfig } from '@helpers4/presets/stryker';

export default {
  ...strykerConfig({ dashboardProject: 'github.com/owner/repo' }),
  thresholds: { break: 60, high: 90, low: 70 }
};
```

## cspell

```jsonc
// cspell.json
{
  "import": ["@helpers4/presets/cspell.json"],
  "words": ["projectSpecificWord"]
}
```

## EditorConfig and git-cliff

Neither tool can read a file from a package, so these two are starting points to copy once:

```bash
cp node_modules/@helpers4/presets/editorconfig .editorconfig
cp node_modules/@helpers4/presets/cliff.toml cliff.toml   # then replace OWNER/REPO
```

## Versions

`@helpers4/presets` is released with every `@helpers4/*` package, under the same version. A stricter rule
can fail a project's lint or type check: read the changelog before upgrading.
