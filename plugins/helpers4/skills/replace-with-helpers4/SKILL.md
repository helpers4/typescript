---
name: replace-with-helpers4
description: Find hand-written TypeScript/JavaScript code that a helpers4 helper already provides (chunk, groupBy, slugify, debounce, retry, deep merge, semver compare, UUID v7, type guards, ...) and propose replacing it, category by category, without adding a dependency you do not need
---

Scan a TypeScript/JavaScript project for code that duplicates a helper of `helpers4/typescript`, and
propose replacing it. This skill is for **using** helpers4 in another project (to propose a helper
that is missing, open an issue on https://github.com/helpers4/typescript/issues). Report first, edit
only after the user agrees.

## 0. Before anything

- Read the live list of helpers: `llms.txt` at https://helpers4.dev/llms.txt and the per-function
  reference at https://helpers4.dev/typescript. The table below is a guide to what to look for, not
  the source of truth: the library grows, and a name can change between versions.
- **Prefer the platform.** If a native API does it, that is the better replacement and needs no
  dependency: `Array.prototype.flat`, `Object.groupBy`, `structuredClone`, `Array.prototype.toSorted`,
  `Promise.withResolvers`, `crypto.randomUUID`, `URL`, `Intl.*`. helpers4 keeps its own list in
  `docs/native-alternatives.json` (https://github.com/helpers4/typescript). Check the project's
  `engines`, `target` and browserslist before proposing a native API.
- helpers4 ships **one npm package per category** (`@helpers4/array`, `@helpers4/string`, ...) and a
  bundle, `helpers4`, imported by subpath (`import { chunk } from 'helpers4/array'`; bare
  `from 'helpers4'` does not resolve). Install the single category when the project needs one, the
  bundle when it needs several.
- helpers4 has had **no independent security audit**. Do not propose it for authentication,
  cryptography or payment code unless the user asks, and flag any security-related candidate
  (`obfuscate`/`deobfuscate` are not encryption; `isHostname`, `sha256Hex`, `escapeHtml`, `stripHtml`
  sit on trust boundaries).
- Read the project's `package.json` first: a `lodash`, `radashi`, `date-fns`, `semver` or `uuid`
  dependency is where the duplication usually lives (see step 1, last paragraph).

## 1. Find candidates

Search the source (skip `node_modules/`, `dist/`, generated and vendored code, and test fixtures)
for these patterns. Each row is *hand-written code* → *the helper that replaces it*:

| Look for | Replace with |
| --- | --- |
| a `for` loop slicing an array into pieces of `n` | `array/chunk` |
| `arr.filter(Boolean)` typed by hand, filtering nullish | `array/compact` |
| `[...new Set(arr)]`, dedup by key with a `Map` | `array/unique`, `uniqueBy` |
| set operations on arrays: `filter(x => !b.includes(x))`, `filter(x => b.includes(x))` | `array/difference`, `intersection`, `symmetricDifference`, `without` |
| `reduce` that counts, sums or averages; `Math.max(...arr)` | `array/countBy`, `sum`, `sumBy`, `mean`, `median`, `percentile`, `min`, `max`, `maxBy` |
| `reduce` that groups into `Record<K, T[]>` | `object/groupBy` |
| split into two arrays by predicate; nested loops for a cartesian product | `array/partition`, `cartesianProduct` |
| Fisher-Yates shuffle, random element, `Array.from({ length })` ranges | `array/shuffle`, `sample`, `range` |
| comparator chains `a.x - b.x \|\| a.y.localeCompare(b.y)`, natural sort | `array/sortBy`, `combineSortFns`, `sortNatural`, `reverseSortFn` |
| `await Promise.all(arr.map(...))` with a concurrency cap, async `filter`/`forEach` | `array/mapAsync`, `filterAsync`, `forEachAsync`, `mapSettled` |
| `JSON.parse(JSON.stringify(x))` to clone; a hand-made `deepClone` | `object/cloneDeep` (or `structuredClone` if the platform allows) |
| a recursive merge; `_.merge` | `object/mergeDeep` |
| `Object.fromEntries(Object.entries(o).filter(...))`, `pick`/`omit` re-written | `object/pick`, `omit`, `pickBy`, `omitBy`, `removeUndefinedNull` |
| `a.b?.c?.[0]` by string path, `_.get`/`_.set` | `object/get`, `set`, `unset`, `update`, `parsePropertyPath` |
| deep equality (`JSON.stringify(a) === JSON.stringify(b)`, `_.isEqual`) | `object/equalsDeep`, `equalsShallow`; arrays: `array/equalsDeep`, `equalsUnordered` |
| keys renamed from camelCase to snake_case recursively | `object/camelCaseKeys`, `snakeCaseKeys`, `kebabCaseKeys`, `pascalCaseKeys` |
| flatten/unflatten `{ 'a.b': 1 }` | `object/flatten`, `unflatten` |
| case converters, slug regexes, `.normalize('NFD').replace(/[̀-ͯ]/g, '')` | `string/camelCase`, `kebabCase`, `snakeCase`, `pascalCase`, `titleCase`, `slugify`, `removeDiacritics` |
| `s.slice(0, n) + '…'`, word-boundary truncation | `string/truncate`, `excerpt` |
| `.replace(/[&<>"']/g, ...)` tables, tag-stripping regexes | `string/escapeHtml`, `unescapeHtml`, `stripHtml` |
| `s.replace(/[.*+?^${}()\|[\]\\]/g, '\\$&')` | `string/escapeRegExp` |
| hand-written Levenshtein, fuzzy match | `string/levenshteinDistance`, `levenshteinSimilarity` |
| glob-to-regex conversion, `minimatch`-like matching for simple globs | `string/globToRegExp`, `matchGlob`, `createGlobMatcher`, `createMatcher` |
| `btoa`/`atob` wrappers handling Unicode | `string/toBase64`, `fromBase64` |
| `str.trim() === ''`, `!str \|\| !str.trim()` | `string/isBlank`, `isNotBlank`, `isEmpty` |
| `{{name}}` interpolation, dedenting template literals | `string/template`, `dedent` |
| `debounce`, `throttle`, `once`, `memoize`, `pipe`/`compose` re-implemented | `function/debounce`, `throttle`, `once`, `memoize`, `pipe`, `compose`, `curry` |
| `new Promise(r => setTimeout(r, ms))` | `promise/delay` |
| retry loops with backoff, `Promise.race` timeouts | `promise/retry`, `timeout` |
| `let resolve; new Promise(r => resolve = r)` | `promise/defer` (or `Promise.withResolvers`) |
| `try { await x } catch { }` returning a tuple | `promise/tryit`, `settle` |
| a hand-made mutex or semaphore | `promise/createMutex`, `createSemaphore` |
| `fetch` + `if (!res.ok) throw` + `res.json()` | `promise/fetchJson`, `fetchOrThrow`, `safeFetch` |
| pagination loops over `next` cursors | `promise/paginate` |
| `new Date(x)` validity checks, `isNaN(d.getTime())` | `date/isValid`, `ensureDate`, `validate` |
| adding days/months, start of day/week, ISO week | `date/add`, `startOf`, `isoWeek`, `weekday` |
| "3 hours ago", `"1h30m"` parsing and formatting | `date/timeAgo`, `formatDuration`, `parseDuration` |
| `Math.min(Math.max(x, lo), hi)`, linear interpolation, rounding to n decimals | `number/clamp`, `lerp`, `roundTo` |
| `0.1 + 0.2` fixes, `Intl.NumberFormat` compact wrappers, `1.5 KB` sizes | `number/correctFloat`, `formatCompact`, `formatSize` |
| `x % 2 === 0` | `number/isEven`, `isOdd` (only worth it when it reads better) |
| `typeof x === 'string'` guards copied between files, `isPlainObject` re-written | `guard/isString`, `isNumber`, `isPlainObject`, `isDefined`, `isNullish`, `isPromiseLike`, ... |
| JSON/JSON5/NDJSON validity checks, `try { JSON.parse }` with a fallback | `json/safeParse`, `parseStrict`, `parseLines`, `guard/isJSON`, `isNdjson` |
| semver compare by splitting on `.`, or a `semver` dependency used for a few calls | `version/parse`, `compare`, `increment`, `satisfiesRange`, `sortVersions`, `isValid` (also debian, rpm, pep440, maven, ... schemes) |
| UUID v4 generated by hand, `uuid` for one call | `id/uuid7` (time-ordered; `crypto.randomUUID()` for v4) |
| hex to RGB, contrast ratio, color mixing | `color/hexToRgb`, `rgbToHsl`, `contrastRatio`, `mixColors`, `blendColors` |
| `new URL(x, base)` joins, trailing/leading slash fixes, "is this link external" checks | `url/withTrailingSlash`, `withoutLeadingSlash`, `cleanPath`, `relativeURLToAbsolute`, `isExternal` |
| `ResizeObserver`/`IntersectionObserver`/`matchMedia` wrappers, idle callbacks | `browser/observeResize`, `observeIntersection`, `watchMedia`, `whenIdle` |
| Conventional Commits regexes | `commit/parseConventionalCommit`, `isConventionalCommit`, `analyzeCommits` |
| ``new Promise`` + `fs.readFile` + `JSON.parse`, temp dirs | `node/safeReadJsonFile`, `withTempDir` |
| `Pick<T, K>`-style utility types copied between projects | `type/DeepPartial`, `Prettify`, `Brand`, `Maybe`, `Nullable`, `UnionToIntersection` |

Also count the **dependencies used only for one of these** (a `lodash` used for `chunk` and `get`, a
`slugify`, `ms`, `uuid`, `semver` or `p-retry` dependency): helpers4 may let the project drop it, but
say what is lost. Check the helper's JSDoc for edge cases (empty input, `NaN`, time zones, locale)
before claiming equivalence, and say plainly when it is not a drop-in.

## 2. Report before editing

Give the user a table, most valuable first:

| Where (`file:line`) | Current code | Helper | Gain | Risk |
| --- | --- | --- | --- | --- |

`Gain`: fewer lines, a typed result, a case the hand-written code misses (say which), a dependency
removed. `Risk`: a behavior difference (read the helper's JSDoc: its edge cases are documented), a
security-related candidate, a dependency added, bundle size. Say plainly when there are no
candidates. Do not pad the list with matches that are not really duplicates, and do not list a
one-liner that is clearer inline.

## 3. Apply, after the user agrees

- Install only what is needed, with the project's package manager: `@helpers4/<category>` for one
  category, `helpers4` for several. Never install `@helpers4/all` (it holds peer dependencies only,
  no code).
- Import from the package, never from a file path: `import { chunk } from '@helpers4/array'`, or
  `from 'helpers4/array'` with the bundle.
- Replace one candidate at a time and keep the project's own tests passing after each. Where the
  helper's edge cases differ from the old code, add or adjust a test to pin the behavior the project
  actually wants.
- helpers4 functions do not mutate their arguments. If the old code relied on mutation, change the
  caller to use the returned value.
- Do not change the project's public API to fit a helper, and do not reformat unrelated code.
- Run the project's typecheck, lint and tests. If a dependency became unused, remove it and update
  the lockfile.

## 4. Do not

- Replace code that the platform covers: use the platform.
- Replace code in a security-critical path without telling the user the library is unaudited.
- Add helpers4 for a single one-liner that is clearer inline.
- Commit unless asked to this turn.
