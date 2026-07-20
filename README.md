<p align="center">
  <img src="logo/Logo.svg" alt="helpers4" width="200" />
</p>

<h1 align="center">@helpers4</h1>

<p align="center">
  <strong>Lightweight, tree-shakable TypeScript utility functions for everyday projects.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@helpers4/all"><img src="https://img.shields.io/npm/v/@helpers4/all?label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@helpers4/array"><img src="https://img.shields.io/npm/dm/@helpers4/array?color=blue&label=downloads" alt="npm downloads" /></a>
  <br>
  <a href="https://github.com/helpers4/typescript/blob/main/LICENSE"><img src="https://img.shields.io/github/license/helpers4/typescript?color=blue" alt="license" /></a>
  <img src="https://img.shields.io/badge/TypeScript-7-blue?logo=typescript&logoColor=white" alt="TypeScript 7" />
  <img src="https://img.shields.io/badge/tree--shakable-✓-blue" alt="tree-shakable" />
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
  <br>
  <a href="https://codecov.io/github/helpers4/typescript"><img src="https://codecov.io/github/helpers4/typescript/graph/badge.svg?token=CW88VQUMTM"/></a>
  <a href="https://dashboard.stryker-mutator.io/reports/github.com/helpers4/typescript/main"><img src="https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fhelpers4%2Ftypescript%2Fmain" alt="mutation score" /></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/helpers4/typescript"><img src="https://api.securityscorecards.dev/projects/github.com/helpers4/typescript/badge" alt="OpenSSF Scorecard" /></a>
  <a href="https://bestpractices.coreinfrastructure.org/projects/13423"><img src="https://bestpractices.coreinfrastructure.org/projects/13423/badge" alt="OpenSSF Best Practices" /></a>
  <br>
  <a href="https://deepwiki.com/helpers4/typescript"><img src="https://img.shields.io/badge/DeepWiki-helpers4%2Ftypescript-blue" alt="Ask DeepWiki" /></a>
</p>

---

## Overview

`@helpers4` is a collection of zero-dependency helper functions designed for any TypeScript or JavaScript project, regardless of framework. Every function is individually importable and fully supports tree-shaking — only the code you use ends up in your bundle.

## Packages

Install only what you need, or grab everything at once:

| Package | Description | Install |
|---------|-------------|---------|
| [`@helpers4/all`](https://www.npmjs.com/package/@helpers4/all) | Complete collection — all categories in one package | `npm i @helpers4/all` |
| [`@helpers4/array`](https://www.npmjs.com/package/@helpers4/array) | Array operations, chunking, comparison, and manipulation | `npm i @helpers4/array` |
| [`@helpers4/ci`](https://www.npmjs.com/package/@helpers4/ci) | CI/CD workflow status formatting for PR comments and pipeline reports | `npm i @helpers4/ci` |
| [`@helpers4/color`](https://www.npmjs.com/package/@helpers4/color) | Color conversion and validation utilities | `npm i @helpers4/color` |
| [`@helpers4/commit`](https://www.npmjs.com/package/@helpers4/commit) | Conventional Commits parsing, validation, and analysis | `npm i @helpers4/commit` |
| [`@helpers4/date`](https://www.npmjs.com/package/@helpers4/date) | Date utilities, comparison, and validation | `npm i @helpers4/date` |
| [`@helpers4/function`](https://www.npmjs.com/package/@helpers4/function) | Function composition and utility wrappers | `npm i @helpers4/function` |
| [`@helpers4/guard`](https://www.npmjs.com/package/@helpers4/guard) | Runtime type guard utilities | `npm i @helpers4/guard` |
| [`@helpers4/id`](https://www.npmjs.com/package/@helpers4/id) | Unique identifier generation (UUID v7, etc.) | `npm i @helpers4/id` |
| [`@helpers4/markdown`](https://www.npmjs.com/package/@helpers4/markdown) | Markdown formatting and escaping utilities | `npm i @helpers4/markdown` |
| [`@helpers4/node`](https://www.npmjs.com/package/@helpers4/node) | Node.js runtime utilities (Buffer, etc.) | `npm i @helpers4/node` |
| [`@helpers4/number`](https://www.npmjs.com/package/@helpers4/number) | Numeric operations and formatting | `npm i @helpers4/number` |
| [`@helpers4/object`](https://www.npmjs.com/package/@helpers4/object) | Object manipulation, deep comparison, and merging | `npm i @helpers4/object` |
| [`@helpers4/observable`](https://www.npmjs.com/package/@helpers4/observable) | RxJS Observable helpers and operators | `npm i @helpers4/observable` |
| [`@helpers4/promise`](https://www.npmjs.com/package/@helpers4/promise) | Promise utilities, retry, delay, and error handling | `npm i @helpers4/promise` |
| [`@helpers4/string`](https://www.npmjs.com/package/@helpers4/string) | String manipulation — capitalize, slugify, camelCase, etc. | `npm i @helpers4/string` |
| [`@helpers4/type`](https://www.npmjs.com/package/@helpers4/type) | Compile-time TypeScript utility types | `npm i @helpers4/type` |
| [`@helpers4/url`](https://www.npmjs.com/package/@helpers4/url) | URL parsing, manipulation, and normalization | `npm i @helpers4/url` |
| [`@helpers4/version`](https://www.npmjs.com/package/@helpers4/version) | Semantic version parsing and comparison | `npm i @helpers4/version` |

## Quick Start

```bash
npm install @helpers4/string @helpers4/array
```

```typescript
import { capitalize } from '@helpers4/string';
import { chunk } from '@helpers4/array';

capitalize('hello world');  // "Hello world"
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

## Key Features

- **Zero dependencies** — no bloat, no supply-chain risk
- **Tree-shakable** — only import what you use
- **TypeScript-first** — full type safety with generics
- **Individually packaged** — install one category or all of them
- **Consistent API** — uniform naming conventions across all modules (e.g., `shallowEquals`, `deepCompare`, `compare`)
- **Fully tested** — comprehensive test suite with 100% coverage, property-based testing via fast-check, and mutation testing via Stryker

## Documentation

Full API documentation is available at **[helpers4.dev/typescript](https://helpers4.dev/typescript)**.

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Lint
pnpm lint

# Build all packages
pnpm build
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/helpers4/.github/blob/main/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to the branch and open a Pull Request

## License

This project is licensed under the [GNU Lesser General Public License v3.0](LICENSE) — you can freely use it in proprietary or open-source projects.

## Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 150.0; height: 150.0">
        <a href="https://github.com/baxyz">
            <img src="https://avatars.githubusercontent.com/u/7852177?v=4" width="100;" alt="Bérenger"/>
            <br />
            <sub style="font-size:14px"><b>Bérenger</b></sub>
        </a>
    </td>
</tr>
</table>
