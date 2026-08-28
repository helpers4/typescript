/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { stringifyGentoo } from './_gentoo';
import { stringifySemVer } from './_semver';
import type { ParsedVersion } from './types';

/**
 * Reconstructs a version string from a {@link ParsedVersion} object — the scheme is read from
 * the object's own `scheme` field, not passed separately (a `ParsedGentooVersion` can only ever
 * stringify as Gentoo, so there's nothing to disambiguate).
 *
 * This is the inverse of {@link parse}:
 * `stringify(parse(v)) === stripV(v)` for any valid version string `v`, in either scheme.
 *
 * @param parsed - A parsed version object, as returned by {@link parse}.
 * @returns The reconstructed version string (without leading `v`).
 * @example
 * stringify({ scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
 * // => '1.2.3'
 * @example
 * stringify({ scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] })
 * // => '2.0.0-alpha.1'
 * @example
 * stringify({ scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 })
 * // => '1.2.3b_rc1-r2'
 * @since 2.0.0
 */
export function stringify(parsed: ParsedVersion): string;
export function stringify(parsed: undefined): undefined;
export function stringify(parsed: null): null;
export function stringify(parsed: ParsedVersion | undefined | null): string | undefined | null {
  if (parsed === undefined || parsed === null) return parsed;
  switch (parsed.scheme) {
    case 'semver':
      return stringifySemVer(parsed);
    case 'gentoo':
      return stringifyGentoo(parsed);
    default:
      return assertNeverScheme(parsed);
  }
}
