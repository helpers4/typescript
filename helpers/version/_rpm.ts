/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal RPM implementation shared by parse.ts, compare.ts, stringify.ts, and the other
 * scheme dispatchers. Not exported from the package barrel — tests live in _rpm.test.ts.
 */

import { satisfiesRelation } from './_relation';
import { splitEvr, stringifyEvr } from './_evr';
import type { ParsedRpmVersion } from './types';

/** @ignore */
const ALLOWED = /^[A-Za-z0-9._+~^]+$/;

/** @ignore */
export function parseRpm(version: string): ParsedRpmVersion {
  return { scheme: 'rpm', ...splitEvr(version, 'RPM', ALLOWED) };
}

/** @ignore */
const isDigit = (char: string | undefined): boolean => char !== undefined && char >= '0' && char <= '9';
/** @ignore */
const isAlpha = (char: string | undefined): boolean => char !== undefined && ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
/** @ignore */
const isAlnum = (char: string | undefined): boolean => isDigit(char) || isAlpha(char);

/**
 * RPM's `rpmvercmp()`: alternates numeric and alphabetic segments, ignoring every other
 * character except `~` (sorts before everything, even the end of the string) and `^` (sorts
 * after the end of the string but before any other segment). A numeric segment is newer than an
 * alphabetic one; numbers compare by value, letters by code point.
 * @ignore
 */
export function rpmvercmp(a: string, b: string): number {
  if (a === b) return 0;
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    while (i < a.length && !isAlnum(a[i]) && a[i] !== '~' && a[i] !== '^') i++;
    while (j < b.length && !isAlnum(b[j]) && b[j] !== '~' && b[j] !== '^') j++;

    if (a[i] === '~' || b[j] === '~') {
      if (a[i] !== '~') return 1;
      if (b[j] !== '~') return -1;
      i++;
      j++;
      continue;
    }

    if (a[i] === '^' || b[j] === '^') {
      if (i >= a.length) return -1;
      if (j >= b.length) return 1;
      if (a[i] !== '^') return 1;
      if (b[j] !== '^') return -1;
      i++;
      j++;
      continue;
    }

    if (i >= a.length || j >= b.length) break;

    const numeric = isDigit(a[i]);
    const matches = numeric ? isDigit : isAlpha;
    const startA = i;
    const startB = j;
    while (matches(a[i])) i++;
    while (matches(b[j])) j++;

    // The segments are of different kinds: the numeric one is newer.
    if (startB === j) return numeric ? 1 : -1;

    let segmentA = a.slice(startA, i);
    let segmentB = b.slice(startB, j);
    if (numeric) {
      segmentA = segmentA.replace(/^0+/, '');
      segmentB = segmentB.replace(/^0+/, '');
      if (segmentA.length !== segmentB.length) return segmentA.length > segmentB.length ? 1 : -1;
    }
    if (segmentA !== segmentB) return segmentA < segmentB ? -1 : 1;
  }

  if (i >= a.length && j >= b.length) return 0;
  return i < a.length ? 1 : -1;
}

/** @ignore */
export function compareParsedRpm(a: ParsedRpmVersion, b: ParsedRpmVersion): number {
  const releases = a.release !== '' && b.release !== '' ? rpmvercmp(a.release, b.release) : 0;
  return Math.sign(a.epoch - b.epoch || rpmvercmp(a.version, b.version) || releases);
}

/** @ignore */
export function compareRpm(version1: string, version2: string): number {
  return compareParsedRpm(parseRpm(version1), parseRpm(version2));
}

/** @ignore */
export function stringifyRpm(parsed: ParsedRpmVersion): string {
  return stringifyEvr(parsed);
}

/**
 * An RPM version is a "prerelease" when its version contains `~`, the convention for a version
 * that must sort before the final release (`1.0~rc1` < `1.0`).
 * @ignore
 */
export function isPrereleaseRpm(parsed: ParsedRpmVersion): boolean {
  return parsed.version.includes('~');
}

/** @ignore */
export function incrementRpm(): never {
  throw new Error("increment: RPM versions are free-form (no major/minor/patch structure), so the 'rpm' scheme does not support increment");
}

/** @ignore */
export function incrementPrereleaseRpm(): never {
  throw new Error("incrementPrerelease: RPM versions are free-form (no prerelease counter), so the 'rpm' scheme does not support incrementPrerelease");
}

/** @ignore */
export function satisfiesRangeRpm(version: string, range: string): boolean {
  return satisfiesRelation(version, range, compareRpm, 'RPM');
}
