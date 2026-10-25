/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal pacman (libalpm) implementation shared by parse.ts, compare.ts, stringify.ts, and the
 * other scheme dispatchers. Not exported from the package barrel — tests live in _pacman.test.ts.
 */

import { satisfiesRelation } from './_relation';
import { splitEvr, stringifyEvr } from './_evr';
import type { ParsedPacmanVersion } from './types';

/** @ignore */
const ALLOWED = /^[^\s:/-]+$/;

/** @ignore */
export function parsePacman(version: string): ParsedPacmanVersion {
  return { scheme: 'pacman', ...splitEvr(version, 'pacman', ALLOWED) };
}

/** @ignore */
const isDigit = (char: string | undefined): boolean => char !== undefined && char >= '0' && char <= '9';
/** @ignore */
const isAlpha = (char: string | undefined): boolean => char !== undefined && ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
/** @ignore */
const isAlnum = (char: string | undefined): boolean => isDigit(char) || isAlpha(char);

/**
 * libalpm's `rpmvercmp()` (the one `vercmp` and `pacman` use): like RPM's without `~` and `^`,
 * but the separators between segments count — when they differ in length, the longer one wins
 * (`2___a` > `2_a`) — and a trailing alphabetic segment loses to the end of the string (`1.0rc` <
 * `1.0`) while a trailing numeric one wins (`1.0.1` > `1.0`).
 * @ignore
 */
export function alpmvercmp(a: string, b: string): number {
  if (a === b) return 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const separatorA = i;
    const separatorB = j;
    while (i < a.length && !isAlnum(a[i])) i++;
    while (j < b.length && !isAlnum(b[j])) j++;

    if (i >= a.length || j >= b.length) break;
    if (i - separatorA !== j - separatorB) return i - separatorA < j - separatorB ? -1 : 1;

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
  // A leftover alphabetic segment never beats the end of the string; anything else does.
  return (i >= a.length && !isAlpha(b[j])) || isAlpha(a[i]) ? -1 : 1;
}

/** @ignore */
export function compareParsedPacman(a: ParsedPacmanVersion, b: ParsedPacmanVersion): number {
  const releases = a.release !== '' && b.release !== '' ? alpmvercmp(a.release, b.release) : 0;
  return Math.sign(a.epoch - b.epoch || alpmvercmp(a.version, b.version) || releases);
}

/** @ignore */
export function comparePacman(version1: string, version2: string): number {
  return compareParsedPacman(parsePacman(version1), parsePacman(version2));
}

/** @ignore */
export function stringifyPacman(parsed: ParsedPacmanVersion): string {
  return stringifyEvr(parsed);
}

/**
 * A pacman version is a "prerelease" when it has an alphabetic segment after its first number:
 * pacman sorts such a segment below the same version without it (`1.0rc1` < `1.0`).
 * @ignore
 */
export function isPrereleasePacman(parsed: ParsedPacmanVersion): boolean {
  return /\d[^A-Za-z0-9]*[A-Za-z]/.test(parsed.version);
}

/** @ignore */
export function incrementPacman(): never {
  throw new Error("increment: pacman versions are free-form (no major/minor/patch structure), so the 'pacman' scheme does not support increment");
}

/** @ignore */
export function incrementPrereleasePacman(): never {
  throw new Error("incrementPrerelease: pacman versions are free-form (no prerelease counter), so the 'pacman' scheme does not support incrementPrerelease");
}

/** @ignore */
export function satisfiesRangePacman(version: string, range: string): boolean {
  return satisfiesRelation(version, range, comparePacman, 'pacman');
}
