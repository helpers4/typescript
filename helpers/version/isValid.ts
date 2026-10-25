/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseDebian } from './_debian';
import { parseGentoo } from './_gentoo';
import { parsePacman } from './_pacman';
import { parsePep440 } from './_pep440';
import { parseRpm } from './_rpm';
import type { VersionScheme } from './types';

/** SemVer 2.0.0, section 2 and the grammar of semver.org: no leading zeros, no `v`, three numbers. */
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

/**
 * Options for {@link isValid}.
 * @since 3.1.9
 */
export interface IsValidOptions {
  /**
   * What to do with a leading `v`, the git-tag convention (`v1.2.3`), for the `'semver'` scheme
   * (the other schemes ignore it):
   * - `'forbid'` (default): a `v` makes the version invalid;
   * - `'allow'`: with or without a `v`;
   * - `'require'`: a `v` is mandatory, to check a tag.
   */
  prefix?: 'forbid' | 'allow' | 'require';
}

/**
 * Whether `version` is a valid version in the given `scheme`. Never throws: any input that is
 * not valid, a non-string included, gives `false`.
 *
 * **`'semver'`** (default) — SemVer 2.0.0, strictly: `MAJOR.MINOR.PATCH` with no leading zeros, an
 * optional `-prerelease` (numeric identifiers without leading zeros) and an optional `+build`.
 * Unlike {@link parse}, which reads anything, and unlike {@link compare}, a leading `v` is refused
 * by default (`v1.2.3` is a git tag, not a version; see {@link IsValidOptions.prefix} to accept or
 * require it), and so are `1.2` and `1.2.3.4`.
 *
 * **`'gentoo'`**, **`'debian'`**, **`'rpm'`**, **`'pacman'`**, **`'pep440'`** — whether {@link parse}
 * accepts it (these schemes throw on invalid input, so their grammar is the one `parse` documents).
 *
 * **`'maven'`** — any non-empty string: Maven reads every text as a version.
 *
 * @param version - The value to check
 * @param scheme - Which version scheme to validate against. Defaults to `'semver'`.
 * @param options - The treatment of a leading `v` — see {@link IsValidOptions}
 * @returns `true` if `version` is a valid version
 * @example
 * isValid('1.2.3')         // => true
 * isValid('1.0.0-rc.1+b5') // => true
 * isValid('v1.2.3')        // => false (a tag, not a version)
 * isValid('01.2.3')        // => false (leading zero)
 * isValid('garbage')       // => false
 * @example
 * isValid('v1.2.3', 'semver', { prefix: 'require' }) // => true (a tag)
 * isValid('1.2.3', 'semver', { prefix: 'require' })  // => false (no v)
 * isValid('1.2.3', 'semver', { prefix: 'allow' })    // => true
 * @example
 * isValid('1:2.30~rc1-3', 'debian') // => true
 * isValid('1.0_1', 'debian')        // => false
 * @since 3.1.9
 */
export function isValid(version: unknown, scheme: VersionScheme = 'semver', options: IsValidOptions = {}): boolean {
  if (typeof version !== 'string') return false;
  switch (scheme) {
    case 'semver': {
      const tagged = version.startsWith('v');
      if (tagged ? options.prefix !== 'allow' && options.prefix !== 'require' : options.prefix === 'require') return false;
      return SEMVER.test(tagged ? version.slice(1) : version);
    }
    case 'maven':
      return version !== '';
    case 'gentoo':
      return parses(parseGentoo, version);
    case 'debian':
      return parses(parseDebian, version);
    case 'rpm':
      return parses(parseRpm, version);
    case 'pacman':
      return parses(parsePacman, version);
    case 'pep440':
      return parses(parsePep440, version);
    default:
      return false;
  }
}

function parses(parseVersion: (version: string) => unknown, version: string): boolean {
  try {
    parseVersion(version);
    return true;
  } catch {
    return false;
  }
}
