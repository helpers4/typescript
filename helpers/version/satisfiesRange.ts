/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Checks if a version satisfies a range (simple implementation)
 * @param version - Version to check
 * @param range - Range pattern (e.g., ">=1.0.0", "~1.2.0", "^1.0.0")
 * @returns True if version satisfies the range
 */
export function satisfiesRange(version: string, range: string): boolean {
  const normalize = (v: string) => v.replace(/^v/, '');
  const normalizedVersion = normalize(version);

  // Handle exact match
  if (!range.match(/[~^<>=]/)) {
    return normalizedVersion === normalize(range);
  }

  // Handle >= operator
  if (range.startsWith('>=')) {
    const targetVersion = normalize(range.slice(2));
    return compareVersionsSimple(normalizedVersion, targetVersion) >= 0;
  }

  // Handle > operator
  if (range.startsWith('>')) {
    const targetVersion = normalize(range.slice(1));
    return compareVersionsSimple(normalizedVersion, targetVersion) > 0;
  }

  // Handle <= operator
  if (range.startsWith('<=')) {
    const targetVersion = normalize(range.slice(2));
    return compareVersionsSimple(normalizedVersion, targetVersion) <= 0;
  }

  // Handle < operator
  if (range.startsWith('<')) {
    const targetVersion = normalize(range.slice(1));
    return compareVersionsSimple(normalizedVersion, targetVersion) < 0;
  }

  // Handle caret range (^1.2.3 allows patch and minor updates)
  if (range.startsWith('^')) {
    const targetVersion = normalize(range.slice(1));
    const [targetMajor] = targetVersion.split('.').map(Number);
    const [versionMajor] = normalizedVersion.split('.').map(Number);

    return versionMajor === targetMajor &&
      compareVersionsSimple(normalizedVersion, targetVersion) >= 0;
  }

  // Handle tilde range (~1.2.3 allows patch updates)
  if (range.startsWith('~')) {
    const targetVersion = normalize(range.slice(1));
    const [targetMajor, targetMinor] = targetVersion.split('.').map(Number);
    const [versionMajor, versionMinor] = normalizedVersion.split('.').map(Number);

    return versionMajor === targetMajor &&
      versionMinor === targetMinor &&
      compareVersionsSimple(normalizedVersion, targetVersion) >= 0;
  }

  // Unsupported range format
  return false;
}

function compareVersionsSimple(version1: string, version2: string): number {
  const parts1 = version1.split('.').map(Number);
  const parts2 = version2.split('.').map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
}
