/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal Gentoo/Portage implementation shared by parse.ts, compare.ts, and stringify.ts.
 * Not exported from the package barrel — tests live in _gentoo.test.ts.
 */

import { combineSortFns } from '../array/combineSortFns';
import type { SortFn } from '../array/sort';
import type { GentooSuffix, GentooSuffixType, IncrementType, ParsedGentooVersion } from './types';

/** @ignore */
const GENTOO_VERSION_RE = /^(\d+(?:\.\d+)*)([a-z])?((?:_(?:alpha|beta|pre|rc|p)\d*)*)(?:-r(\d+))?$/;
/** @ignore */
const GENTOO_SUFFIX_RE = /_(alpha|beta|pre|rc|p)(\d*)/g;

/**
 * Ranks a Gentoo suffix type for comparison — `alpha`/`beta`/`pre`/`rc` sort below a plain
 * release, `p` sorts above it. `undefined` (no suffix at all) is the plain release itself.
 * @ignore
 */
const SUFFIX_RANK: Record<GentooSuffixType | 'release', number> = {
  alpha: 0,
  beta: 1,
  pre: 2,
  rc: 3,
  release: 4,
  p: 5,
};

/** @ignore */
export function parseGentoo(version: string): ParsedGentooVersion {
  const match = GENTOO_VERSION_RE.exec(version);
  if (!match) {
    throw new SyntaxError(`parse: "${version}" is not a valid Gentoo/Portage ebuild version`);
  }
  const [, componentsStr, letter, suffixesStr, revisionStr] = match;

  const components = componentsStr.split('.').map(Number);

  const suffixes: GentooSuffix[] = [];
  GENTOO_SUFFIX_RE.lastIndex = 0;
  let suffixMatch: RegExpExecArray | null;
  while ((suffixMatch = GENTOO_SUFFIX_RE.exec(suffixesStr)) !== null) {
    suffixes.push({
      type: suffixMatch[1] as GentooSuffixType,
      number: suffixMatch[2] ? Number(suffixMatch[2]) : 0,
    });
  }

  return {
    scheme: 'gentoo',
    components,
    letter: letter ?? '',
    suffixes,
    revision: revisionStr ? Number(revisionStr) : 0,
  };
}

/** @ignore */
function compareComponents(a: readonly number[], b: readonly number[]): number {
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return av < bv ? -1 : 1;
  }
  return 0;
}

/**
 * Compares by the *last* suffix segment only — see {@link ParsedGentooVersion}'s doc for why
 * chained multi-suffix versions aren't specially handled.
 * @ignore
 */
function compareSuffixes(a: readonly GentooSuffix[], b: readonly GentooSuffix[]): number {
  const lastA = a[a.length - 1];
  const lastB = b[b.length - 1];
  const rankA = SUFFIX_RANK[lastA?.type ?? 'release'];
  const rankB = SUFFIX_RANK[lastB?.type ?? 'release'];
  if (rankA !== rankB) return rankA < rankB ? -1 : 1;

  const numA = lastA?.number ?? 0;
  const numB = lastB?.number ?? 0;
  if (numA !== numB) return numA < numB ? -1 : 1;
  return 0;
}

/**
 * A gentoo version is a "prerelease" exactly when its last suffix segment ranks below the
 * plain release — `alpha`/`beta`/`pre`/`rc`. `p` (patch level) doesn't count: it ranks above
 * release, and neither does a `-r` revision, which isn't a suffix segment at all.
 * @ignore
 */
export function isPrereleaseGentoo(parsed: ParsedGentooVersion): boolean {
  const last = parsed.suffixes[parsed.suffixes.length - 1];
  return SUFFIX_RANK[last?.type ?? 'release'] < SUFFIX_RANK.release;
}

// The four precedence steps, in order, composed via combineSortFns (array/) instead of a
// hand-rolled "if not equal, return" chain — each step is independently readable, and the
// precedence order is just the argument order rather than implicit in early-return control flow.
const compareByComponents: SortFn<ParsedGentooVersion> = (a, b) => compareComponents(a.components, b.components);
const compareByLetter: SortFn<ParsedGentooVersion> = (a, b) => (a.letter === b.letter ? 0 : a.letter < b.letter ? -1 : 1);
const compareBySuffixes: SortFn<ParsedGentooVersion> = (a, b) => compareSuffixes(a.suffixes, b.suffixes);
const compareByRevision: SortFn<ParsedGentooVersion> = (a, b) => (a.revision === b.revision ? 0 : a.revision < b.revision ? -1 : 1);

/** @ignore */
const compareParsedGentoo = combineSortFns<ParsedGentooVersion>(compareByComponents, compareByLetter, compareBySuffixes, compareByRevision);

/** @ignore */
export function compareGentoo(version1: string, version2: string): number {
  return compareParsedGentoo(parseGentoo(version1), parseGentoo(version2));
}

/**
 * Reconstructs the canonical string form. A suffix given without trailing digits (e.g. bare
 * `_beta`) round-trips to itself, but an *explicit* `_beta0` would canonicalize to `_beta` —
 * the two are equivalent per the spec, and no real ebuild writes the redundant `0`.
 * @ignore
 */
export function stringifyGentoo(parsed: ParsedGentooVersion): string {
  const base = parsed.components.join('.');
  const suffixes = parsed.suffixes.map((s) => `_${s.type}${s.number > 0 ? s.number : ''}`).join('');
  const revision = parsed.revision > 0 ? `-r${parsed.revision}` : '';
  return `${base}${parsed.letter}${suffixes}${revision}`;
}

/** @ignore */
const INCREMENT_COMPONENT_INDEX: Record<IncrementType, number> = { major: 0, minor: 1, patch: 2 };

/**
 * Bumps the component at `type`'s position (`major` → index 0, `minor` → 1, `patch` → 2 — the
 * same positional convention as SemVer, generalized since Gentoo's `components` array can be
 * any length), zeroing every component after it and dropping the letter/suffixes/revision —
 * matching {@link incrementSemVer}'s "bumping X resets everything finer-grained" behavior.
 * @ignore
 */
export function incrementGentoo(version: string, type: IncrementType): string {
  const index = INCREMENT_COMPONENT_INDEX[type];
  if (index === undefined) {
    throw new Error(`Invalid increment type: ${type}`);
  }

  const parsed = parseGentoo(version);
  const components = [...parsed.components];
  // Always at least major.minor.patch, like SemVer — a bare "1" incrementing "minor" should
  // produce "1.1.0", not "1.1" (extra pre-existing components beyond 3 are left in place).
  while (components.length < 3) components.push(0);
  // Not `components[index]!++` — @stryker-mutator/instrumenter@10.0.0 crashes instrumenting an
  // UpdateExpression whose argument is a TSNonNullExpression (TypeError: "expected node to be
  // of a type [Identifier, MemberExpression] but instead got TSNonNullExpression").
  components[index] = components[index]! + 1;
  for (let i = index + 1; i < components.length; i++) components[i] = 0;

  return stringifyGentoo({ scheme: 'gentoo', components, letter: '', suffixes: [], revision: 0 });
}

/** @ignore */
const GENTOO_SUFFIX_TYPES: readonly GentooSuffixType[] = ['alpha', 'beta', 'pre', 'rc', 'p'];

/**
 * Gentoo equivalent of `incrementPrereleaseSemVer` — no current prerelease suffix bumps the
 * last numeric component and starts a fresh suffix at `0` (bare, e.g. `_alpha`); the same
 * suffix type increments its counter; a different type resets it to `0`. `prereleaseId` must be
 * one of the five real Gentoo suffix types (`alpha`/`beta`/`pre`/`rc`/`p`) — unlike SemVer's
 * free-form prerelease identifiers, Portage's suffix vocabulary is fixed by spec.
 * @ignore
 */
export function incrementPrereleaseGentoo(version: string, prereleaseId: string): string {
  if (!GENTOO_SUFFIX_TYPES.includes(prereleaseId as GentooSuffixType)) {
    throw new Error(`incrementPrerelease: "${prereleaseId}" is not a valid Gentoo suffix type (expected one of ${GENTOO_SUFFIX_TYPES.join(', ')})`);
  }
  const suffixType = prereleaseId as GentooSuffixType;
  const parsed = parseGentoo(version);

  if (!isPrereleaseGentoo(parsed)) {
    // parseGentoo's grammar requires at least one numeric component, so this index is always valid.
    const components = [...parsed.components];
    const lastIndex = components.length - 1;
    // Not `components[lastIndex]!++` — see incrementGentoo's comment on the same pattern.
    components[lastIndex] = components[lastIndex]! + 1;
    return stringifyGentoo({ ...parsed, components, suffixes: [{ type: suffixType, number: 0 }], revision: 0 });
  }

  const current = parsed.suffixes[parsed.suffixes.length - 1]!;
  const shouldIncrement = current.type === suffixType;
  return stringifyGentoo({ ...parsed, suffixes: [{ type: suffixType, number: shouldIncrement ? current.number + 1 : 0 }], revision: 0 });
}

/**
 * Gentoo range check, mirroring `satisfiesRangeSemVer`'s operator set except `^`/`~` — Portage's
 * own atom syntax gives those characters different, unrelated meanings (dependency-atom
 * revision matching, not SemVer-style caret/tilde ranges), so reusing SemVer's semantics for
 * them here would be actively misleading rather than merely unsupported.
 * @ignore
 */
export function satisfiesRangeGentoo(version: string, range: string): boolean {
  if (range.startsWith('^') || range.startsWith('~')) {
    throw new Error(`satisfiesRange: '${range[0]}' ranges are SemVer-specific and have no Gentoo/Portage equivalent — use >=, >, <=, <, or an exact version instead`);
  }
  if (!/[<>=]/.test(range)) {
    return compareGentoo(version, range) === 0;
  }
  if (range.startsWith('>=')) return compareGentoo(version, range.slice(2)) >= 0;
  if (range.startsWith('>')) return compareGentoo(version, range.slice(1)) > 0;
  if (range.startsWith('<=')) return compareGentoo(version, range.slice(2)) <= 0;
  if (range.startsWith('<')) return compareGentoo(version, range.slice(1)) < 0;
  return false;
}
