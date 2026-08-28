/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal Gentoo/Portage implementation shared by parse.ts, compare.ts, and stringify.ts.
 * Not exported from the package barrel — tests live in _gentoo.test.ts.
 */

import type { GentooSuffix, GentooSuffixType, ParsedGentooVersion } from './types';

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

/** @ignore */
export function compareGentoo(version1: string, version2: string): number {
  const v1 = parseGentoo(version1);
  const v2 = parseGentoo(version2);

  const componentsCmp = compareComponents(v1.components, v2.components);
  if (componentsCmp !== 0) return componentsCmp;

  if (v1.letter !== v2.letter) return v1.letter < v2.letter ? -1 : 1;

  const suffixCmp = compareSuffixes(v1.suffixes, v2.suffixes);
  if (suffixCmp !== 0) return suffixCmp;

  if (v1.revision !== v2.revision) return v1.revision < v2.revision ? -1 : 1;
  return 0;
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
