/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal SemVer implementation shared by parse.ts, compare.ts, and stringify.ts.
 * Not exported from the package barrel — tests live in the public functions' own test files,
 * which already exercise every branch here.
 */

import { combineSortFns } from '../array/combineSortFns';
import type { SortFn } from '../array/sort';
import type { IncrementType, ParsedSemVerVersion } from './types';

/** @ignore */
export function parseSemVer(version: string): ParsedSemVerVersion {
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
    scheme: 'semver',
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    prerelease,
    build,
  };
}

/**
 * Compares two prerelease identifier arrays according to SemVer spec
 * Rules:
 * - Numeric identifiers are compared as integers
 * - Alphanumeric identifiers are compared lexically (ASCII)
 * - Numeric identifiers have lower precedence than alphanumeric
 * - A larger set of prerelease fields has higher precedence if all preceding are equal
 * @ignore
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
    else if (isNum1) {
      return -1;
    } else if (isNum2) {
      return 1;
    }
    // Both alphanumeric: compare lexically (ASCII sort)
    else {
      if (id1 < id2) return -1;
      if (id1 > id2) return 1;
      // id1 === id2, continue to next identifier
    }
  }

  return 0;
}

// The four precedence steps, in order, composed via combineSortFns (array/) instead of a
// hand-rolled "if not equal, return" chain — matches the same pattern _gentoo.ts's
// compareGentoo uses. Build metadata is ignored per SemVer spec, so it isn't a step here.
const compareByMajor: SortFn<ParsedSemVerVersion> = (a, b) => (a.major === b.major ? 0 : a.major < b.major ? -1 : 1);
const compareByMinor: SortFn<ParsedSemVerVersion> = (a, b) => (a.minor === b.minor ? 0 : a.minor < b.minor ? -1 : 1);
const compareByPatch: SortFn<ParsedSemVerVersion> = (a, b) => (a.patch === b.patch ? 0 : a.patch < b.patch ? -1 : 1);
const compareByPrerelease: SortFn<ParsedSemVerVersion> = (a, b) => comparePrerelease(a.prerelease, b.prerelease);

/** @ignore */
const compareParsedSemVer = combineSortFns<ParsedSemVerVersion>(compareByMajor, compareByMinor, compareByPatch, compareByPrerelease);

/** @ignore */
export function compareSemVer(version1: string, version2: string): number {
  return compareParsedSemVer(parseSemVer(version1), parseSemVer(version2));
}

/** @ignore */
export function stringifySemVer(parsed: ParsedSemVerVersion): string {
  const base = `${parsed.major}.${parsed.minor}.${parsed.patch}`;
  const prerelease = parsed.prerelease.length > 0 ? `-${parsed.prerelease.join('.')}` : '';
  const build = parsed.build.length > 0 ? `+${parsed.build.join('.')}` : '';
  return `${base}${prerelease}${build}`;
}

/** @ignore */
export function incrementSemVer(version: string, type: IncrementType): string {
  const hasV = version.startsWith('v');
  let { major, minor, patch } = parseSemVer(version);

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

  const result = stringifySemVer({ scheme: 'semver', major, minor, patch, prerelease: [], build: [] });
  return hasV ? `v${result}` : result;
}

/**
 * `npm version prerelease --preid <id>` semantics: no current prerelease bumps patch and starts
 * a new prerelease line at `<id>.0`; the same prerelease type increments its counter; a
 * different type resets the counter to `0`. Build metadata is dropped either way — it's tied to
 * the specific build that produced the input version, not the new one.
 * @ignore
 */
export function incrementPrereleaseSemVer(version: string, prereleaseId: string): string {
  const hasV = version.startsWith('v');
  const parsed = parseSemVer(version);
  const [currentId, currentNum] = parsed.prerelease;

  const shouldIncrement = currentId === prereleaseId && typeof currentNum === 'string' && currentNum !== '' && Number.isFinite(Number(currentNum));

  const result =
    parsed.prerelease.length === 0
      ? stringifySemVer({ ...parsed, patch: parsed.patch + 1, prerelease: [prereleaseId, '0'], build: [] })
      : stringifySemVer({ ...parsed, prerelease: [prereleaseId, shouldIncrement ? String(Number(currentNum) + 1) : '0'], build: [] });

  return hasV ? `v${result}` : result;
}

/**
 * Simple range check ("simple implementation", per the original doc) — the operators
 * (`>=`/`>`/`<=`/`<`/`^`/`~`) all delegate to a naive dot-separated numeric compare, not the
 * full SemVer precedence rules (prerelease identifiers aren't specially handled here).
 * @ignore
 */
export function satisfiesRangeSemVer(version: string, range: string): boolean {
  const normalizedVersion = version.replace(/^v/, '');

  if (!range.match(/[~^<>=]/)) {
    return normalizedVersion === range.replace(/^v/, '');
  }

  if (range.startsWith('>=')) {
    return compareVersionsSimple(normalizedVersion, range.slice(2).replace(/^v/, '')) >= 0;
  }
  if (range.startsWith('>')) {
    return compareVersionsSimple(normalizedVersion, range.slice(1).replace(/^v/, '')) > 0;
  }
  if (range.startsWith('<=')) {
    return compareVersionsSimple(normalizedVersion, range.slice(2).replace(/^v/, '')) <= 0;
  }
  if (range.startsWith('<')) {
    return compareVersionsSimple(normalizedVersion, range.slice(1).replace(/^v/, '')) < 0;
  }

  if (range.startsWith('^')) {
    const targetVersion = range.slice(1).replace(/^v/, '');
    const [targetMajor] = targetVersion.split('.').map(Number);
    const [versionMajor] = normalizedVersion.split('.').map(Number);
    return versionMajor === targetMajor && compareVersionsSimple(normalizedVersion, targetVersion) >= 0;
  }

  if (range.startsWith('~')) {
    const targetVersion = range.slice(1).replace(/^v/, '');
    const [targetMajor, targetMinor] = targetVersion.split('.').map(Number);
    const [versionMajor, versionMinor] = normalizedVersion.split('.').map(Number);
    return versionMajor === targetMajor && versionMinor === targetMinor && compareVersionsSimple(normalizedVersion, targetVersion) >= 0;
  }

  return false;
}

/** @ignore */
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
