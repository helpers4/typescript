# helpers4

Complete collection of all helpers4 utilities, organized by category, in a single npm package.
No peer dependencies to remember and no risk of missing a category — one install gets you
everything.

## Installation

```bash
npm install helpers4
```

## Usage

Import from `helpers4/<category>`. The package root (`import ... from 'helpers4'`) is
intentionally not usable — there is no code there, only the per-category subpaths below:

```typescript
import { chunk } from 'helpers4/array';
import { capitalize } from 'helpers4/string';
import { cleanPath } from 'helpers4/url';
```

This is exactly equivalent to installing the scoped packages individually:

```typescript
import { chunk } from '@helpers4/array';
import { capitalize } from '@helpers4/string';
import { cleanPath } from '@helpers4/url';
```

`helpers4/<category>` re-exports `@helpers4/<category>` verbatim — same code, same types, same
version, just reachable through one package instead of many. Prefer `@helpers4/<category>`
directly when you want the smallest possible dependency footprint for a single category; prefer
`helpers4` when you want one package that always has every category available, which is
especially convenient for AI coding assistants that otherwise have to be told to install every
`@helpers4/<category>` package individually.

## Included Categories

{{categories_table}}

## License

LGPL-3.0
