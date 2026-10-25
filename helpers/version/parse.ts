/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { parseDebian } from './_debian';
import { parseMaven } from './_maven';
import { parsePacman } from './_pacman';
import { parsePep440 } from './_pep440';
import { parseRpm } from './_rpm';
import { parseGentoo } from './_gentoo';
import { parseSemVer } from './_semver';
import type {
  AnyParsedVersion,
  ParsedDebianVersion,
  ParsedGentooVersion,
  ParsedMavenVersion,
  ParsedPacmanVersion,
  ParsedPep440Version,
  ParsedRpmVersion,
  ParsedSemVerVersion,
  VersionScheme,
} from './types';

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
 * **`'debian'`** — Debian/dpkg versions, `[epoch:]upstream[-revision]` (see
 * {@link ParsedDebianVersion}). Throws a `SyntaxError` on whitespace, a non-numeric epoch, an
 * empty upstream or revision, or a character Debian Policy doesn't allow.
 *
 * **`'rpm'`** — RPM versions, `[epoch:]version[-release]` (see {@link ParsedRpmVersion}). Throws a
 * `SyntaxError` on whitespace, a non-numeric epoch, an empty version or release, or a character RPM
 * does not allow.
 *
 * **`'pacman'`** — Arch Linux package versions, `[epoch:]pkgver[-pkgrel]` (see
 * {@link ParsedPacmanVersion}). Throws a `SyntaxError` like `'rpm'`.
 *
 * **`'pep440'`** — Python PEP 440 versions (see {@link ParsedPep440Version}); every spelling is
 * normalized (`1.0-ALPHA.2` → `pre: { type: 'a', number: 2 }`). Throws a `SyntaxError` if `version`
 * is not a valid PEP 440 version.
 *
 * **`'maven'`** — Maven versions as `ComparableVersion` reads them (see {@link ParsedMavenVersion}).
 * Never throws: Maven accepts any text.
 *
 * @param version - Version string to parse
 * @param scheme - Which version scheme to parse `version` as. Defaults to `'semver'`.
 * @returns The parsed version, shaped per `scheme` — {@link ParsedSemVerVersion} for `'semver'`,
 * {@link ParsedGentooVersion} for `'gentoo'`, {@link ParsedDebianVersion} for `'debian'`, {@link ParsedRpmVersion} for `'rpm'`,
 * {@link ParsedPacmanVersion} for `'pacman'`, {@link ParsedPep440Version} for `'pep440'`, {@link ParsedMavenVersion} for `'maven'`.
 * @example
 * parse('1.2.3') // { scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] }
 * parse('v1.0.0-alpha.1') // { scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] }
 * parse('2.0.0+build.123') // { scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: [], build: ['build', '123'] }
 * @example
 * parse('1.2.3b_rc1-r2', 'gentoo')
 * // { scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 }
 * @example
 * parse('1:2.30~rc1-3ubuntu2', 'debian')
 * // { scheme: 'debian', epoch: 1, upstream: '2.30~rc1', revision: '3ubuntu2' }
 * @example
 * parse('1:2.30~rc1-3.fc40', 'rpm')
 * // { scheme: 'rpm', epoch: 1, version: '2.30~rc1', release: '3.fc40' }
 * @example
 * parse('1.0-ALPHA.2', 'pep440')
 * // { scheme: 'pep440', epoch: 0, release: [1, 0], pre: { type: 'a', number: 2 }, post: null, dev: null, local: [] }
 * @since 2.0.0
 */
export function parse(version: string, scheme?: 'semver'): ParsedSemVerVersion;
export function parse(version: string, scheme: 'gentoo'): ParsedGentooVersion;
export function parse(version: string, scheme: 'debian'): ParsedDebianVersion;
export function parse(version: string, scheme: 'rpm'): ParsedRpmVersion;
export function parse(version: string, scheme: 'pacman'): ParsedPacmanVersion;
export function parse(version: string, scheme: 'pep440'): ParsedPep440Version;
export function parse(version: string, scheme: 'maven'): ParsedMavenVersion;
export function parse(version: string, scheme: VersionScheme): AnyParsedVersion;
export function parse(version: undefined, scheme?: VersionScheme): undefined;
export function parse(version: null, scheme?: VersionScheme): null;
export function parse(version: string | undefined | null, scheme: VersionScheme = 'semver'): AnyParsedVersion | undefined | null {
  if (version === undefined || version === null) return version;
  switch (scheme) {
    case 'semver':
      return parseSemVer(version);
    case 'gentoo':
      return parseGentoo(version);
    case 'debian':
      return parseDebian(version);
    case 'rpm':
      return parseRpm(version);
    case 'pacman':
      return parsePacman(version);
    case 'pep440':
      return parsePep440(version);
    case 'maven':
      return parseMaven(version);
    default:
      return assertNeverScheme(scheme);
  }
}
