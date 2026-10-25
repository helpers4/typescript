/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { satisfiesRangeDebian } from './_debian';
import { satisfiesRangeGentoo } from './_gentoo';
import { satisfiesRangePacman } from './_pacman';
import { satisfiesRangePep440 } from './_pep440';
import { satisfiesRangeRpm } from './_rpm';
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
 * **`'rpm'`**, **`'pacman'`** — dependency relations: `<`, `<=`, `=` (or `==`), `>=`, `>` followed by a
 * version, or a bare version for an exact match; whitespace after the operator is allowed. Compared
 * per RPM / pacman ordering (see {@link compare}).
 *
 * **`'pep440'`** — a PEP 440 specifier set, as in `requirements.txt`: comma-separated clauses that
 * must all hold, each one of `==` / `!=` (also with a `.*` prefix, e.g. `==1.2.*`), `<`, `<=`, `>`,
 * `>=`, `~=` (compatible release: `~=1.4.5` is `>=1.4.5, ==1.4.*`) or `===` (exact string). Follows
 * `packaging`'s rules: `<2.0` does not admit `2.0rc1`, `>2.0` does not admit `2.0.post1`. Pre-releases
 * are not excluded otherwise.
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
 * @example
 * satisfiesRange('2.30-3.fc40', '>= 2.0', 'rpm') // true
 * satisfiesRange('1.4.9', '~=1.4.5', 'pep440') // true
 * satisfiesRange('2.0rc1', '<2.0', 'pep440')   // false — a pre-release of 2.0
 * satisfiesRange('1.5', '>=1.0,<2.0', 'pep440') // true
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
    case 'rpm':
      return satisfiesRangeRpm(version, range);
    case 'pacman':
      return satisfiesRangePacman(version, range);
    case 'pep440':
      return satisfiesRangePep440(version, range);
    default:
      return assertNeverScheme(scheme);
  }
}
