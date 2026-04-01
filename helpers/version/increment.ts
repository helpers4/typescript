/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Increments a semantic version
 * @param version - The version to increment
 * @param type - The increment type ('major', 'minor', 'patch')
 * @returns Incremented version string
 */
export function increment(
  version: string,
  type: 'major' | 'minor' | 'patch'
): string {
  const normalize = (v: string) => v.replace(/^v/, '');
  const hasV = version.startsWith('v');
  const normalizedVersion = normalize(version);

  const parts = normalizedVersion.split('.').map(Number);

  // Ensure we have at least major.minor.patch
  while (parts.length < 3) {
    parts.push(0);
  }

  let [major, minor, patch] = parts;

  switch (type) {
    case 'major':
      major++;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor++;
      patch = 0;
      break;
    case 'patch':
      patch++;
      break;
    default:
      throw new Error(`Invalid increment type: ${type}`);
  }

  const result = `${major}.${minor}.${patch}`;
  return hasV ? `v${result}` : result;
}
