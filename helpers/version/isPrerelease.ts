/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { ParsedVersion } from './parse';

/**
 * Returns `true` when the version string has a prerelease suffix
 * (i.e. contains a `-` after the core `MAJOR.MINOR.PATCH`).
 *
 * @param version - A semantic version string (e.g. `'2.0.0-alpha.1'`, `'1.0.0'`).
 * @returns `true` if the version is a prerelease, `false` otherwise.
 * @example
 * isPrerelease('2.0.0-alpha.1') // true
 * isPrerelease('1.0.0-rc.0')   // true
 * isPrerelease('1.0.0')        // false
 * isPrerelease('2.1.0')        // false
 * @since next
 */
export function isPrerelease(version: string): boolean;
/**
 * Returns `true` when the parsed version has at least one prerelease identifier.
 *
 * @param version - A {@link ParsedVersion} object (as returned by {@link parse}).
 * @returns `true` if `version.prerelease` is non-empty, `false` otherwise.
 * @example
 * isPrerelease(parse('2.0.0-alpha.1')) // true
 * isPrerelease(parse('1.0.0'))         // false
 * @since next
 */
export function isPrerelease(version: ParsedVersion): boolean;
export function isPrerelease(version: undefined): undefined;
export function isPrerelease(version: null): null;
export function isPrerelease(version: string | ParsedVersion | undefined | null): boolean | undefined | null {
  if (version === undefined || version === null) return version;
  if (typeof version === 'string') return version.split('+')[0].includes('-');
  return version.prerelease.length > 0;
}
