/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { satisfiesRangeDebian } from './_debian';
import { satisfiesRangeGentoo } from './_gentoo';
import { satisfiesRangeSemVer } from './_semver';
import type { VersionScheme } from './types';

/**
 * Checks if a version satisfies a range, according to the given `scheme` (simple
 * implementation — see each scheme's own doc for exactly which operators are supported).
 *
 * **`'semver'`** (default) — `>=`, `>`, `<=`, `<`, `^` (caret, patch+minor updates within the
 * same major), `~` (tilde, patch updates within the same major.minor), or an exact match.
 *
 * **`'gentoo'`** — `>=`, `>`, `<=`, `<`, or an exact match, compared per Gentoo/Portage
 * ordering (see {@link compare}). `^`/`~` throw: Portage's own atom syntax gives those
 * characters different, unrelated meanings, so silently reusing SemVer's semantics for them
 * would be actively misleading rather than merely unsupported.
 *
 * **`'debian'`** — dpkg relation operators, as written in `Depends:` fields: `<<` (strictly
 * earlier), `<=`, `=`, `>=`, `>>` (strictly later), or an exact match, compared per dpkg ordering
 * (see {@link compare}); whitespace after the operator is allowed (`>= 1.0`). The obsolete
 * single-character `<`/`>` throw — dpkg reads them as `<=`/`>=`, the opposite of what they look
 * like — and so do `^`/`~`.
 *
 * @param version - Version to check
 * @param range - Range pattern (e.g., ">=1.0.0", "~1.2.0", "^1.0.0")
 * @param scheme - Which version scheme to interpret `version`/`range` as. Defaults to `'semver'`.
 * @returns True if version satisfies the range
 * @example
 * satisfiesRange('1.2.3', '>=1.0.0') // true
 * satisfiesRange('1.2.3', '^1.0.0')  // true
 * satisfiesRange('2.0.0', '^1.0.0')  // false
 * @example
 * satisfiesRange('1.2.3', '>=1.2.0', 'gentoo') // true
 * satisfiesRange('1.2.3-r1', '1.2.3', 'gentoo') // false — different revisions, not an exact match
 * satisfiesRange('1.2.3-r0', '1.2.3', 'gentoo') // true — '-r0' is the implicit default, same version
 * @example
 * satisfiesRange('1.0~rc1-1', '<< 1.0', 'debian') // true — ~ sorts before the release
 * satisfiesRange('1:0.9-1', '>= 2.0', 'debian')   // true — the epoch wins
 * @since 1.9.0
 */
export function satisfiesRange(version: string, range: string, scheme: VersionScheme = 'semver'): boolean {
  switch (scheme) {
    case 'semver':
      return satisfiesRangeSemVer(version, range);
    case 'gentoo':
      return satisfiesRangeGentoo(version, range);
    case 'debian':
      return satisfiesRangeDebian(version, range);
    default:
      return assertNeverScheme(scheme);
  }
}
