/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal Debian/dpkg implementation shared by parse.ts, compare.ts, stringify.ts, and the
 * other scheme dispatchers. Not exported from the package barrel — tests live in _debian.test.ts.
 */

import type { ParsedDebianVersion } from './types';

/** @ignore */
const EPOCH_RE = /^(\d+):/;
/** @ignore */
const UPSTREAM_RE = /^[A-Za-z0-9.+~-]+$/;
/** @ignore */
const REVISION_RE = /^[A-Za-z0-9.+~]+$/;

/**
 * Splits `[epoch:]upstream[-revision]` the way dpkg does: the epoch runs up to the *first*
 * colon, the revision starts after the *last* hyphen — so the upstream part may itself contain
 * hyphens as long as a revision follows.
 * @ignore
 */
export function parseDebian(version: string): ParsedDebianVersion {
  const fail = (reason: string): never => {
    throw new SyntaxError(`parse: "${version}" is not a valid Debian version (${reason})`);
  };

  if (/\s/.test(version)) fail('contains whitespace');

  let rest = version;
  let epoch = 0;
  const epochMatch = EPOCH_RE.exec(rest);
  if (epochMatch) {
    epoch = Number(epochMatch[1]);
    rest = rest.slice(epochMatch[0].length);
  } else if (rest.includes(':')) {
    fail('the epoch before ":" must be a non-negative integer');
  }

  const hyphen = rest.lastIndexOf('-');
  const upstream = hyphen === -1 ? rest : rest.slice(0, hyphen);
  const revision = hyphen === -1 ? '' : rest.slice(hyphen + 1);

  if (upstream === '') fail('the upstream version is empty');
  if (!UPSTREAM_RE.test(upstream)) fail('the upstream version may only contain letters, digits and . + ~ -');
  if (hyphen !== -1 && !REVISION_RE.test(revision)) fail('the revision after the last "-" must be non-empty letters, digits and . + ~');

  return { scheme: 'debian', epoch, upstream, revision };
}

/**
 * Sort weight of one character in a non-digit run, per dpkg's `order()`: `~` sorts before
 * everything — even the end of the string — then the end of the string, then letters, then
 * every other character.
 * @ignore
 */
function weight(char: string | undefined): number {
  if (char === undefined) return 0;
  if (char === '~') return -1;
  const code = char.charCodeAt(0);
  return /[A-Za-z]/.test(char) ? code : code + 256;
}

/** @ignore */
function isDigit(char: string | undefined): boolean {
  return char !== undefined && char >= '0' && char <= '9';
}

/**
 * Compares two digit runs numerically without going through `Number`, so a run longer than
 * `Number.MAX_SAFE_INTEGER` (a timestamp-heavy snapshot version) still compares exactly.
 * @ignore
 */
function compareDigitRuns(a: string, b: string): number {
  const trimmedA = a.replace(/^0+/, '');
  const trimmedB = b.replace(/^0+/, '');
  if (trimmedA.length !== trimmedB.length) return trimmedA.length - trimmedB.length;
  return trimmedA === trimmedB ? 0 : trimmedA < trimmedB ? -1 : 1;
}

/**
 * dpkg's `verrevcmp()`: alternates a non-digit run (compared character by character with
 * {@link weight}) and a digit run (compared numerically, an empty run counting as `0`) until
 * one side differs.
 * @ignore
 */
function compareFragment(a: string, b: string): number {
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    while ((i < a.length && !isDigit(a[i])) || (j < b.length && !isDigit(b[j]))) {
      const difference = weight(isDigit(a[i]) ? undefined : a[i]) - weight(isDigit(b[j]) ? undefined : b[j]);
      if (difference !== 0) return difference;
      i++;
      j++;
    }
    const startA = i;
    while (isDigit(a[i])) i++;
    const startB = j;
    while (isDigit(b[j])) j++;
    const difference = compareDigitRuns(a.slice(startA, i), b.slice(startB, j));
    if (difference !== 0) return difference;
  }
  return 0;
}

/** @ignore */
export function compareParsedDebian(a: ParsedDebianVersion, b: ParsedDebianVersion): number {
  const result = a.epoch - b.epoch || compareFragment(a.upstream, b.upstream) || compareFragment(a.revision, b.revision);
  return Math.sign(result);
}

/** @ignore */
export function compareDebian(version1: string, version2: string): number {
  return compareParsedDebian(parseDebian(version1), parseDebian(version2));
}

/**
 * A Debian version is a "prerelease" when its upstream part contains `~` — the convention for
 * versions that must sort before the final release (`1.0~rc1` < `1.0`). A `~` in the revision
 * doesn't count: `1.0-1~bpo12+1` is a backport of the `1.0` release, not a prerelease of it.
 * @ignore
 */
export function isPrereleaseDebian(parsed: ParsedDebianVersion): boolean {
  return parsed.upstream.includes('~');
}

/**
 * Reconstructs the canonical string form. An explicit `0:` epoch is dropped (it's the implicit
 * default, so `0:1.0` and `1.0` are the same version).
 * @ignore
 */
export function stringifyDebian(parsed: ParsedDebianVersion): string {
  const epoch = parsed.epoch > 0 ? `${parsed.epoch}:` : '';
  const revision = parsed.revision === '' ? '' : `-${parsed.revision}`;
  return `${epoch}${parsed.upstream}${revision}`;
}

/** @ignore */
export function incrementDebian(): never {
  throw new Error('increment: Debian upstream versions are free-form (no major/minor/patch structure), so the \'debian\' scheme does not support increment');
}

/** @ignore */
export function incrementPrereleaseDebian(): never {
  throw new Error('incrementPrerelease: Debian upstream versions are free-form (no prerelease counter), so the \'debian\' scheme does not support incrementPrerelease');
}

/** @ignore */
const RELATION_RE = /^(<<|<=|>=|>>|=|<|>)?\s*(.+)$/;

/**
 * dpkg relation operators, as written in `Depends:` fields: `<<` (strictly earlier), `<=`,
 * `=`, `>=`, `>>` (strictly later), or a bare version for an exact match. The obsolete
 * single-character `<` and `>` throw — dpkg historically read them as `<=` and `>=`, the
 * opposite of what they look like, which is exactly why Debian Policy forbids them.
 * @ignore
 */
export function satisfiesRangeDebian(version: string, range: string): boolean {
  const trimmed = range.trim();
  if (trimmed.startsWith('^') || trimmed.startsWith('~')) {
    throw new Error(`satisfiesRange: '${trimmed[0]}' ranges are SemVer-specific and have no Debian equivalent — use <<, <=, =, >=, >>, or an exact version instead`);
  }
  const [, operator = '=', target] = RELATION_RE.exec(trimmed) ?? invalidRelation(range);
  if (operator === '<' || operator === '>') {
    throw new Error(`satisfiesRange: '${operator}' is obsolete in Debian relations (dpkg reads it as '${operator}=') — use '${operator}${operator}' or '${operator}=' instead`);
  }
  const order = compareDebian(version, target!);
  switch (operator) {
    case '<<': return order < 0;
    case '<=': return order <= 0;
    case '>=': return order >= 0;
    case '>>': return order > 0;
    default: return order === 0;
  }
}

/** @ignore */
function invalidRelation(range: string): never {
  throw new SyntaxError(`satisfiesRange: "${range}" is not a valid Debian relation`);
}
