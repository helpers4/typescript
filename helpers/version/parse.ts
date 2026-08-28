/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { parseGentoo } from './_gentoo';
import { parseSemVer } from './_semver';
import type { ParsedGentooVersion, ParsedSemVerVersion, ParsedVersion, VersionScheme } from './types';

/**
 * Parses a version string into its components, according to the given `scheme`.
 *
 * **`'semver'`** (default) — SemVer 2.0.0. Supports:
 * - Core version: MAJOR.MINOR.PATCH
 * - Pre-release: -alpha, -beta.1, -rc.1, -0.3.7, -x.7.z.92
 * - Build metadata: +build, +sha.abc123, +20130313144700
 * - Optional 'v' prefix (commonly used in git tags)
 *
 * **`'gentoo'`** — Gentoo/Portage ebuild versions (see {@link ParsedGentooVersion}). Throws a
 * `SyntaxError` if `version` doesn't match the grammar (unlike `'semver'`, which never throws).
 *
 * @param version - Version string to parse
 * @param scheme - Which version scheme to parse `version` as. Defaults to `'semver'`.
 * @returns The parsed version, shaped per `scheme` — {@link ParsedSemVerVersion} for `'semver'`,
 * {@link ParsedGentooVersion} for `'gentoo'`.
 * @example
 * parse('1.2.3') // { scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] }
 * parse('v1.0.0-alpha.1') // { scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] }
 * parse('2.0.0+build.123') // { scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: [], build: ['build', '123'] }
 * @example
 * parse('1.2.3b_rc1-r2', 'gentoo')
 * // { scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 }
 * @since 2.0.0
 */
export function parse(version: string, scheme?: 'semver'): ParsedSemVerVersion;
export function parse(version: string, scheme: 'gentoo'): ParsedGentooVersion;
export function parse(version: string, scheme: VersionScheme): ParsedVersion;
export function parse(version: undefined, scheme?: VersionScheme): undefined;
export function parse(version: null, scheme?: VersionScheme): null;
export function parse(version: string | undefined | null, scheme: VersionScheme = 'semver'): ParsedVersion | undefined | null {
  if (version === undefined || version === null) return version;
  switch (scheme) {
    case 'semver':
      return parseSemVer(version);
    case 'gentoo':
      return parseGentoo(version);
    default:
      return assertNeverScheme(scheme);
  }
}
