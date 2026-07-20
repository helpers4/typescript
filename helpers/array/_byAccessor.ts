/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helpers shared by sumBy.ts and meanBy.ts.
 * Not exported from the package barrel — tests live in _byAccessor.test.ts.
 */

import { walkPropertyPath } from '../_shared/_walkPropertyPath.js';
import { parsePropertyPath } from '../object/parsePropertyPath.js';

/**
 * A value-deriving iteratee: either a function, or a dot/bracket-notation string path
 * (`'a.b.c'`) / explicit key array (`['a', 'b']`) resolved the same way as `@helpers4/object`'s
 * `get` — shorthand for `item => get(item, path)`.
 *
 * Only `sumBy`/`meanBy` accept this form. The sibling `createSortByStringFn` /
 * `createSortByNumberFn` / `createSortByDateFn` (in `_sortHelpers.ts`) take a `property`
 * argument that looks the same (a string) but means something different there: a single
 * literal object key (`item[property]`), not a dot-path — `'a.b'` resolves a nested value here,
 * but looks up the literal (likely absent) key `'a.b'` there.
 */
export type ByAccessor<T> = ((item: T) => number) | string | readonly PropertyKey[];

/**
 * Normalizes a {@link ByAccessor} into a plain getter function — a function is returned as-is,
 * a string/key-array path is resolved via `parsePropertyPath` + `walkPropertyPath`.
 * @ignore
 */
export function toByAccessorFn<T>(accessor: ByAccessor<T>): (item: T) => number {
  if (typeof accessor === 'function') return accessor;
  const keys = typeof accessor === 'string' ? parsePropertyPath(accessor) : accessor;
  return (item: T) => walkPropertyPath(item, keys) as number;
}
