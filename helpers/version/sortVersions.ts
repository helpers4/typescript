/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compare } from './compare';
import type { VersionScheme } from './types';

/**
 * Options for {@link sortVersions}.
 * @since 3.1.9
 */
export interface SortVersionsOptions {
  /** `'asc'` (oldest first, default) or `'desc'` (newest first). */
  order?: 'asc' | 'desc';
  /** Which version scheme to compare as. Defaults to `'semver'`. */
  scheme?: VersionScheme;
}

/**
 * Sorts version strings by version, not by text (`1.10.0` after `1.9.0`), in the given scheme: the
 * same as `versions.sort((a, b) => compare(a, b, scheme))`, without mutating the input. Versions
 * that compare as equal keep their order. Strings are returned as they were written (a `v` prefix
 * stays).
 *
 * Every version is compared with {@link compare}, so in the schemes that throw on invalid input
 * (`'gentoo'`, `'debian'`, …) a bad version throws a `SyntaxError`: filter with {@link isValid} first.
 *
 * @param versions - The versions to sort
 * @param options - Order and scheme — see {@link SortVersionsOptions}
 * @returns A new sorted array
 * @example
 * sortVersions(['1.10.0', '1.2.0', '1.9.0'])
 * // => ['1.2.0', '1.9.0', '1.10.0']
 * @example
 * sortVersions(['v1.0.0', 'v2.0.0-rc.1', 'v1.5.0'], { order: 'desc' })[0]
 * // => 'v2.0.0-rc.1' — the latest
 * @since 3.1.9
 */
export function sortVersions<T extends string>(versions: readonly T[], options: SortVersionsOptions = {}): T[] {
  const { order = 'asc', scheme = 'semver' } = options;
  const direction = order === 'desc' ? -1 : 1;
  return versions.toSorted((a, b) => direction * compare(a, b, scheme));
}
