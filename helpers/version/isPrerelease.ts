/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { isPrereleaseGentoo } from './_gentoo';
import { parse } from './parse';
import type { AnyParsedVersion, VersionScheme } from './types';

/**
 * Returns `true` when the version string has a prerelease suffix, according to the given
 * `scheme`.
 *
 * **`'semver'`** (default) — `true` when there's a `-` after the core `MAJOR.MINOR.PATCH`.
 *
 * **`'gentoo'`** — `true` when the last suffix segment is `alpha`/`beta`/`pre`/`rc` (these sort
 * below the plain release). A `p` suffix or a `-r` revision don't count — `p` sorts *above* the
 * release, and a revision isn't a prerelease of anything, it's a rebuild of the same version.
 *
 * @param version - A version string (e.g. `'2.0.0-alpha.1'`, `'1.0.0'`, `'1.2.3_rc1'`).
 * @param scheme - Which version scheme to interpret `version` as. Defaults to `'semver'`.
 * @returns `true` if the version is a prerelease, `false` otherwise.
 * @example
 * isPrerelease('2.0.0-alpha.1') // true
 * isPrerelease('1.0.0-rc.0')   // true
 * isPrerelease('1.0.0')        // false
 * isPrerelease('2.1.0')        // false
 * @example
 * isPrerelease('1.2.3_rc1', 'gentoo') // true
 * isPrerelease('1.2.3_p1', 'gentoo')  // false — p sorts above release, not a prerelease
 * isPrerelease('1.2.3-r1', 'gentoo')  // false — a revision, not a prerelease
 * @since 2.0.0
 */
export function isPrerelease(version: string, scheme?: VersionScheme): boolean;
/**
 * Returns `true` when the parsed version has a prerelease suffix — the scheme is read from the
 * object's own `scheme` field, not passed separately.
 *
 * @param version - A {@link AnyParsedVersion} object, as returned by {@link parse}.
 * @returns `true` if `version` is a prerelease, `false` otherwise.
 * @example
 * isPrerelease(parse('2.0.0-alpha.1')) // true
 * isPrerelease(parse('1.0.0'))         // false
 * @since 2.0.0
 */
export function isPrerelease(version: AnyParsedVersion): boolean;
export function isPrerelease(version: undefined): undefined;
export function isPrerelease(version: null): null;
export function isPrerelease(version: string | AnyParsedVersion | undefined | null, scheme: VersionScheme = 'semver'): boolean | undefined | null {
  if (version === undefined || version === null) return version;

  // Normalize to a parsed object first so there's exactly one switch on `.scheme` below,
  // instead of two independent ones (string-input and object-input) that would each need
  // their own case added for every future scheme.
  const parsed = typeof version === 'string' ? parse(version, scheme) : version;

  switch (parsed.scheme) {
    case 'semver':
      return parsed.prerelease.length > 0;
    case 'gentoo':
      return isPrereleaseGentoo(parsed);
    default:
      return assertNeverScheme(parsed);
  }
}
