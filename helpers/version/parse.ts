/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Represents a parsed semantic version according to SemVer 2.0.0 specification
 */
export interface ParsedVersion {
  /** Major version number */
  major: number;
  /** Minor version number */
  minor: number;
  /** Patch version number */
  patch: number;
  /** Pre-release identifiers (e.g., ['alpha', '1'] for -alpha.1) */
  prerelease: string[];
  /** Build metadata identifiers (e.g., ['build', '123'] for +build.123) */
  build: string[];
}

/**
 * Parses a semantic version string into its components according to SemVer 2.0.0 specification
 *
 * Supports:
 * - Core version: MAJOR.MINOR.PATCH
 * - Pre-release: -alpha, -beta.1, -rc.1, -0.3.7, -x.7.z.92
 * - Build metadata: +build, +sha.abc123, +20130313144700
 * - Optional 'v' prefix (commonly used in git tags)
 *
 * @param version - Version string to parse
 * @returns Parsed version object with major, minor, patch, prerelease, and build
 * @example
 * parse('1.2.3') // { major: 1, minor: 2, patch: 3, prerelease: [], build: [] }
 * parse('v1.0.0-alpha.1') // { major: 1, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] }
 * parse('2.0.0+build.123') // { major: 2, minor: 0, patch: 0, prerelease: [], build: ['build', '123'] }
 * parse('1.0.0-beta+exp.sha.5114f85') // { major: 1, minor: 0, patch: 0, prerelease: ['beta'], build: ['exp', 'sha', '5114f85'] }
 */
export function parse(version: string): ParsedVersion {
  // Remove optional 'v' prefix
  const normalized = version.replace(/^v/, '');

  // Split build metadata first (everything after +)
  const [versionWithPrerelease, buildString] = normalized.split('+');
  const build = buildString ? buildString.split('.') : [];

  // Split prerelease (everything after -)
  const [coreVersion, prereleaseString] = versionWithPrerelease.split('-');
  const prerelease = prereleaseString ? prereleaseString.split('.') : [];

  // Parse core version
  const parts = coreVersion.split('.').map(Number);

  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    prerelease,
    build,
  };
}
