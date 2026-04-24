/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { ParsedVersion } from './parse';

/**
 * Reconstruct a semantic version string from a {@link ParsedVersion} object.
 *
 * This is the inverse of {@link parse}:
 * `stringify(parse(v)) === stripV(v)` for any valid SemVer string `v`.
 *
 * @param parsed - A parsed semantic version object.
 * @returns The reconstructed version string (without leading `v`).
 * @example
 * stringify({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })
 * // => '1.2.3'
 * @example
 * stringify({ major: 2, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] })
 * // => '2.0.0-alpha.1'
 * @example
 * stringify({ major: 1, minor: 0, patch: 0, prerelease: ['beta'], build: ['exp', 'sha', '5114f85'] })
 * // => '1.0.0-beta+exp.sha.5114f85'
 * @since next
 */
export function stringify(parsed: ParsedVersion): string;
export function stringify(parsed: undefined): undefined;
export function stringify(parsed: null): null;
export function stringify(parsed: ParsedVersion | undefined | null): string | undefined | null {
  if (parsed === undefined || parsed === null) return parsed;
  const base = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  const prerelease = parsed.prerelease.length > 0 ? `-${parsed.prerelease.join('.')}` : '';
  const build = parsed.build.length > 0 ? `+${parsed.build.join('.')}` : '';
  return `${base}${prerelease}${build}`;
}
