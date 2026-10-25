/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal PEP 440 implementation shared by parse.ts, compare.ts, stringify.ts, and the other
 * scheme dispatchers. Not exported from the package barrel — tests live in _pep440.test.ts.
 */

import type { IncrementType, ParsedPep440Version, Pep440Prerelease } from './types';

/** @ignore */
const VERSION_RE =
  /^v?(?:(\d+)!)?(\d+(?:\.\d+)*)(?:[-_.]?(alpha|a|beta|b|preview|pre|c|rc)[-_.]?(\d+)?)?(?:-(\d+)|[-_.]?(post|rev|r)[-_.]?(\d+)?)?(?:[-_.]?(dev)[-_.]?(\d+)?)?(?:\+([a-z0-9]+(?:[-_.][a-z0-9]+)*))?$/i;

/** @ignore */
const PRERELEASE_TYPES: Record<string, Pep440Prerelease['type']> = {
  alpha: 'a',
  a: 'a',
  beta: 'b',
  b: 'b',
  c: 'rc',
  rc: 'rc',
  pre: 'rc',
  preview: 'rc',
};

/** @ignore */
export function parsePep440(version: string): ParsedPep440Version {
  const match = VERSION_RE.exec(version.trim());
  if (!match) throw new SyntaxError(`parse: "${version}" is not a valid PEP 440 version`);
  const [, epoch, release, preLabel, preNumber, postNumber1, postLabel, postNumber2, devLabel, devNumber, local] = match;

  return {
    scheme: 'pep440',
    epoch: epoch ? Number(epoch) : 0,
    release: release!.split('.').map(Number),
    pre: preLabel ? { type: PRERELEASE_TYPES[preLabel.toLowerCase()]!, number: Number(preNumber ?? 0) } : null,
    post: postNumber1 !== undefined ? Number(postNumber1) : postLabel ? Number(postNumber2 ?? 0) : null,
    dev: devLabel ? Number(devNumber ?? 0) : null,
    local: local ? local.toLowerCase().split(/[-_.]/).map((part) => (/^\d+$/.test(part) ? Number(part) : part)) : [],
  };
}

/** @ignore */
export function stringifyPep440(parsed: ParsedPep440Version): string {
  const epoch = parsed.epoch > 0 ? `${parsed.epoch}!` : '';
  const pre = parsed.pre ? `${parsed.pre.type}${parsed.pre.number}` : '';
  const post = parsed.post === null ? '' : `.post${parsed.post}`;
  const dev = parsed.dev === null ? '' : `.dev${parsed.dev}`;
  const local = parsed.local.length > 0 ? `+${parsed.local.join('.')}` : '';
  return `${epoch}${parsed.release.join('.')}${pre}${post}${dev}${local}`;
}

/** @ignore */
const compareNumbers = (a: number, b: number): number => (a < b ? -1 : a > b ? 1 : 0);

/** The release without its trailing zeros, so `1.0` and `1` are the same version. */
function trimmedRelease(release: number[]): number[] {
  let end = release.length;
  while (end > 0 && release[end - 1] === 0) end--;
  return release.slice(0, end);
}

/** Compares two lists element by element; the shorter one is lower when it is a prefix. */
function compareLists<T>(a: T[], b: T[], compareItems: (x: T, y: T) => number): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const difference = compareItems(a[i]!, b[i]!);
    if (difference !== 0) return difference;
  }
  return compareNumbers(a.length, b.length);
}

/** @ignore */
const PRERELEASE_RANK = { a: 0, b: 1, rc: 2 } as const;

/**
 * The position of the pre-release marker in the ordering: a development release of a version with
 * no pre-release or post-release sorts before all of its pre-releases (`1.0.dev1` < `1.0a1`), a
 * version without a marker sorts after them (`1.0rc1` < `1.0`).
 */
function preKey(parsed: ParsedPep440Version): number[] {
  if (parsed.pre === null) return parsed.post === null && parsed.dev !== null ? [-1] : [4];
  return [PRERELEASE_RANK[parsed.pre.type], parsed.pre.number];
}

/** Numbers sort above strings, as in a PEP 440 local version label. */
function compareLocalPart(a: number | string, b: number | string): number {
  if (typeof a === 'number' && typeof b === 'number') return compareNumbers(a, b);
  if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0;
  return typeof a === 'number' ? 1 : -1;
}

/** @ignore */
export function compareParsedPep440(a: ParsedPep440Version, b: ParsedPep440Version): number {
  return Math.sign(
    compareNumbers(a.epoch, b.epoch) ||
      compareLists(trimmedRelease(a.release), trimmedRelease(b.release), compareNumbers) ||
      compareLists(preKey(a), preKey(b), compareNumbers) ||
      compareNumbers(a.post ?? -1, b.post ?? -1) ||
      compareNumbers(a.dev ?? Infinity, b.dev ?? Infinity) ||
      compareLists(a.local, b.local, compareLocalPart),
  );
}

/** @ignore */
export function comparePep440(version1: string, version2: string): number {
  return compareParsedPep440(parsePep440(version1), parsePep440(version2));
}

/** @ignore */
export function isPrereleasePep440(parsed: ParsedPep440Version): boolean {
  return parsed.pre !== null || parsed.dev !== null;
}

const INCREMENT_INDEX: Record<IncrementType, number> = { major: 0, minor: 1, patch: 2 };

/**
 * Bumps the release component at `type`'s position (`major` → 1st, `minor` → 2nd, `patch` → 3rd,
 * padding the release with zeros up to there), zeroing everything after it and dropping the
 * pre/post/dev/local parts. The epoch is kept.
 * @ignore
 */
export function incrementPep440(version: string, type: IncrementType): string {
  const parsed = parsePep440(version);
  const index = INCREMENT_INDEX[type];
  const release = Array.from({ length: Math.max(parsed.release.length, 3) }, (_, i) => parsed.release[i] ?? 0);
  release[index] = release[index]! + 1;
  release.fill(0, index + 1);
  return stringifyPep440({ ...parsed, release, pre: null, post: null, dev: null, local: [] });
}

/**
 * PEP 440 equivalent of `incrementPrereleaseSemVer`. `prereleaseId` is `'a'`/`'alpha'`, `'b'`/`'beta'`
 * or `'rc'`/`'c'`/`'pre'`/`'preview'`. A version that is not a pre-release gets its patch bumped
 * and starts at `<id>0` (`1.2.3` → `1.2.4a0`); a pre-release with the same marker increments its
 * number; with another one it restarts at `0`. Post, dev and local parts are dropped.
 * @ignore
 */
export function incrementPrereleasePep440(version: string, prereleaseId: string): string {
  const type = PRERELEASE_TYPES[prereleaseId.toLowerCase()];
  if (type === undefined) {
    throw new Error(`incrementPrerelease: "${prereleaseId}" is not a valid PEP 440 pre-release marker (expected one of a, b, rc)`);
  }
  const parsed = parsePep440(version);
  if (parsed.pre === null) {
    const bumped = parsePep440(incrementPep440(version, 'patch'));
    return stringifyPep440({ ...bumped, pre: { type, number: 0 } });
  }
  const number = parsed.pre.type === type ? parsed.pre.number + 1 : 0;
  return stringifyPep440({ ...parsed, pre: { type, number }, post: null, dev: null, local: [] });
}

/** @ignore */
const SPECIFIER_RE = /^(===|~=|==|!=|<=|>=|<|>)\s*(\S+)$/;

const withoutLocal = (parsed: ParsedPep440Version): ParsedPep440Version => ({ ...parsed, local: [] });
const baseVersion = (parsed: ParsedPep440Version): ParsedPep440Version => ({ ...parsed, pre: null, post: null, dev: null, local: [] });
const isPostrelease = (parsed: ParsedPep440Version): boolean => parsed.post !== null;

/** `==1.2.*`: same epoch, and the release starts with the given one (the shorter side padded with zeros). */
function matchesPrefix(version: ParsedPep440Version, prefix: ParsedPep440Version): boolean {
  return (
    version.epoch === prefix.epoch &&
    prefix.release.every((part, i) => (version.release[i] ?? 0) === part)
  );
}

function satisfiesClause(version: ParsedPep440Version, rawVersion: string, clause: string): boolean {
  const [, operator, target] = SPECIFIER_RE.exec(clause) ?? [];
  if (operator === undefined) throw new SyntaxError(`satisfiesRange: "${clause}" is not a valid PEP 440 specifier (expected an operator such as >=, ==, ~=)`);
  if (operator === '===') return rawVersion.trim().toLowerCase() === target!.toLowerCase();

  const wildcard = target!.endsWith('.*');
  if (wildcard && operator !== '==' && operator !== '!=') {
    throw new SyntaxError(`satisfiesRange: "${clause}" — a ".*" suffix is only allowed with == and !=`);
  }
  const spec = parsePep440(wildcard ? target!.slice(0, -2) : target!);
  if (wildcard && (spec.pre !== null || spec.post !== null || spec.dev !== null || spec.local.length > 0)) {
    throw new SyntaxError(`satisfiesRange: "${clause}" — a ".*" suffix only follows a release segment`);
  }

  switch (operator) {
    case '==':
    case '!=': {
      const equal = wildcard
        ? matchesPrefix(version, spec)
        : compareParsedPep440(spec.local.length > 0 ? version : withoutLocal(version), spec) === 0;
      return operator === '==' ? equal : !equal;
    }
    case '<=':
      return compareParsedPep440(withoutLocal(version), spec) <= 0;
    case '>=':
      return compareParsedPep440(withoutLocal(version), spec) >= 0;
    case '<':
      // `<2.0` does not admit `2.0rc1`, a pre-release of the excluded version, unless 2.0 is one itself.
      return (
        compareParsedPep440(version, spec) < 0 &&
        !(!isPrereleasePep440(spec) && isPrereleasePep440(version) && compareParsedPep440(baseVersion(version), baseVersion(spec)) === 0)
      );
    case '>':
      // `>2.0` does not admit `2.0.post1` nor `2.0+local`, unless 2.0 is a post-release itself.
      return (
        compareParsedPep440(version, spec) > 0 &&
        !(!isPostrelease(spec) && isPostrelease(version) && compareParsedPep440(baseVersion(version), baseVersion(spec)) === 0) &&
        !(version.local.length > 0 && compareParsedPep440(baseVersion(version), baseVersion(spec)) === 0)
      );
    default: {
      // `~=1.4.5` is `>=1.4.5, ==1.4.*`: the release without its last component is the prefix.
      if (spec.release.length < 2) {
        throw new SyntaxError(`satisfiesRange: "${clause}" — a compatible release (~=) needs at least two release components`);
      }
      const prefix = { ...spec, release: spec.release.slice(0, -1) };
      return compareParsedPep440(withoutLocal(version), spec) >= 0 && matchesPrefix(version, prefix);
    }
  }
}

/**
 * A PEP 440 specifier set: comma-separated clauses that must all hold. Supported operators:
 * `==` and `!=` (with a `.*` prefix match), `<`, `<=`, `>`, `>=`, `~=` (compatible release) and
 * `===` (exact string match). Pre-releases are not excluded unless a clause does so itself.
 * @ignore
 */
export function satisfiesRangePep440(version: string, range: string): boolean {
  const parsed = parsePep440(version);
  const clauses = range.split(',').map((clause) => clause.trim()).filter((clause) => clause !== '');
  return clauses.every((clause) => satisfiesClause(parsed, version, clause));
}
