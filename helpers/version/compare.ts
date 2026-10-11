/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { compareDebian } from './_debian';
import { compareGentoo } from './_gentoo';
import { compareSemVer } from './_semver';
import type { VersionScheme } from './types';

/**
 * Compares two version strings, according to the given `scheme`.
 *
 * **`'semver'`** (default) — SemVer 2.0.0 precedence rules:
 * - Core version: MAJOR.MINOR.PATCH
 * - Pre-release: -alpha, -beta.1, -rc.1, etc. (sorts below the plain release)
 * - Build metadata: +build, +sha.abc123 (ignored in comparison per spec)
 * - Optional 'v' prefix
 *
 * **`'gentoo'`** — Gentoo/Portage ebuild version ordering (see {@link ParsedGentooVersion}):
 * numeric components, then letter suffix, then suffix segment (`alpha`/`beta`/`pre`/`rc` sort
 * below the plain release, `p` sorts above it), then `-r` revision. Note the key difference
 * from SemVer: a `-r` revision is *not* a prerelease and sorts *above* the base version.
 *
 * **`'debian'`** — dpkg/apt ordering (see {@link ParsedDebianVersion}): epoch first, then the
 * upstream version, then the Debian revision, each compared like dpkg's `verrevcmp` — digit runs
 * numerically, everything else character by character with `~` sorting before everything,
 * even the end of the string (`1.0~rc1` < `1.0`). Throws a `SyntaxError` on an invalid version.
 *
 * @param version1 - First version string
 * @param version2 - Second version string
 * @param scheme - Which version scheme to compare `version1`/`version2` as. Defaults to `'semver'`.
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 * @example
 * compare('1.0.0', '2.0.0') // -1
 * compare('1.0.0-alpha', '1.0.0') // -1 (prerelease < release)
 * compare('1.0.0-alpha.1', '1.0.0-alpha.2') // -1
 * compare('1.0.0+build1', '1.0.0+build2') // 0 (build metadata ignored)
 * @example
 * compare('1.2.3', '1.2.3-r1', 'gentoo') // -1 (a revision is newer than its base version)
 * compare('1.2.3_alpha1', '1.2.3', 'gentoo') // -1 (alpha sorts below release)
 * compare('1.2.3_p1', '1.2.3', 'gentoo') // 1 (p sorts above release)
 * @example
 * compare('1.0~rc1', '1.0', 'debian') // -1 (~ sorts before the release)
 * compare('1:0.9', '2.0', 'debian') // 1 (a higher epoch wins)
 * compare('2.30-3', '2.30-10', 'debian') // -1 (revisions compare numerically)
 * @since 1.9.0
 */
export function compare(version1: string, version2: string, scheme: VersionScheme = 'semver'): number {
  switch (scheme) {
    case 'semver':
      return compareSemVer(version1, version2);
    case 'gentoo':
      return compareGentoo(version1, version2);
    case 'debian':
      return compareDebian(version1, version2);
    default:
      return assertNeverScheme(scheme);
  }
}
