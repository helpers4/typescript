/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { parse } from './parse';

/**
 * Compares two prerelease identifier arrays according to SemVer spec
 * Rules:
 * - Numeric identifiers are compared as integers
 * - Alphanumeric identifiers are compared lexically (ASCII)
 * - Numeric identifiers have lower precedence than alphanumeric
 * - A larger set of prerelease fields has higher precedence if all preceding are equal
 * @param pre1 - First prerelease array
 * @param pre2 - Second prerelease array
 * @returns -1, 0, or 1
 */
function comparePrerelease(pre1: string[], pre2: string[]): number {
  // No prerelease has higher precedence than prerelease
  // e.g., 1.0.0 > 1.0.0-alpha
  if (pre1.length === 0 && pre2.length === 0) return 0;
  if (pre1.length === 0) return 1; // No prerelease > prerelease
  if (pre2.length === 0) return -1; // prerelease < no prerelease

  const maxLength = Math.max(pre1.length, pre2.length);

  for (let i = 0; i < maxLength; i++) {
    // A larger set has higher precedence if all preceding are equal
    if (i >= pre1.length) return -1;
    if (i >= pre2.length) return 1;

    const id1 = pre1[i];
    const id2 = pre2[i];

    if (id1 === id2) continue;

    const isNum1 = /^\d+$/.test(id1);
    const isNum2 = /^\d+$/.test(id2);

    // Both numeric: compare as integers
    if (isNum1 && isNum2) {
      const num1 = parseInt(id1, 10);
      const num2 = parseInt(id2, 10);
      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
      // num1 === num2, continue to next identifier
    }

    // Numeric has lower precedence than alphanumeric
    if (isNum1) return -1;
    if (isNum2) return 1;

    // Both alphanumeric: compare lexically (ASCII sort)
    if (id1 < id2) return -1;
    if (id1 > id2) return 1;
    // id1 === id2, continue to next identifier
  }

  return 0;
}

/**
 * Compares two semantic version strings according to SemVer 2.0.0 specification
 *
 * Supports:
 * - Core version: MAJOR.MINOR.PATCH
 * - Pre-release: -alpha, -beta.1, -rc.1, etc.
 * - Build metadata: +build, +sha.abc123 (ignored in comparison per spec)
 * - Optional 'v' prefix
 *
 * @param version1 - First version string
 * @param version2 - Second version string
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 * @example
 * compare('1.0.0', '2.0.0') // -1
 * compare('1.0.0-alpha', '1.0.0') // -1 (prerelease < release)
 * compare('1.0.0-alpha', '1.0.0-beta') // -1
 * compare('1.0.0-alpha.1', '1.0.0-alpha.2') // -1
 * compare('1.0.0+build1', '1.0.0+build2') // 0 (build metadata ignored)
 */
export function compare(version1: string, version2: string): number {
  const v1 = parse(version1);
  const v2 = parse(version2);

  // Compare major, minor, patch
  if (v1.major !== v2.major) return v1.major < v2.major ? -1 : 1;
  if (v1.minor !== v2.minor) return v1.minor < v2.minor ? -1 : 1;
  if (v1.patch !== v2.patch) return v1.patch < v2.patch ? -1 : 1;

  // Compare prerelease (build metadata is ignored per SemVer spec)
  return comparePrerelease(v1.prerelease, v2.prerelease);
}
