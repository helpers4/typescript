# Deprecated in v3 (removed in v4)

These symbols still work in v3 but are marked `@deprecated` and will be removed in v4. Each
replacement already exists, so you can switch now.

| Deprecated | Use instead | Available since |
| ---------- | ----------- | --------------- |
| `object.safeJsonParse` | `json.safeParseStrict` (same parsing, same `fallback` behavior) | v3.2.0 |
| `promise.fetchJson`, `promise.fetchOrThrow`, `promise.safeFetch`, `promise.HttpError` and their option types | the same names in `@helpers4/fetch` (same code; `HttpError` is the same class, so `instanceof` works with both) | v3.2.0 |

# Migrating to v3

v3 removes symbols that were marked `@deprecated` in v2 and splits the old `type` category into
two focused ones. All replacements have existed since the versions noted below, so upgrading is
a find-and-replace exercise — no logic changes required.

## `@helpers4/type` → `@helpers4/guard` (runtime guards)

Runtime type guards (`isString`, `isArray`, `isDefined`, …) moved to a new `@helpers4/guard`
package. `@helpers4/type` now only contains compile-time-only utility types (`DeepPartial`,
`Maybe`, `Prettify`, …) and has no runtime footprint.

```diff
-import { isString, isArray } from '@helpers4/type';
+import { isString, isArray } from '@helpers4/guard';
```

If you only used compile-time types (`import type { DeepPartial } from '@helpers4/type'`), no
change is needed.

## Removed aliases

| Removed | Use instead | Available since |
| ------- | ------------ | ---------------- |
| `object.deepMerge` | `object.mergeDeep` | v1.9.0 |
| `object.deepClone` | `object.cloneDeep` | v1.9.0 |
| `date.daysDifference` | `date.difference` (richer API: unit, sign) | v2.0.0 |
| `date.safeDate` | `date.ensureDate` | v1.9.0 |
| `date.dateToISOString` | `date.toISO8601` | v1.9.0 |
| `type.isEmpty` | `array.isEmpty` / `string.isEmpty` / `object.isEmpty` (per-category) | v2.0.0 |

Each replacement carries the same JSDoc/behavior as the symbol it replaces.
