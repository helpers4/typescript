/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal Maven implementation shared by parse.ts, compare.ts, stringify.ts, and the other
 * scheme dispatchers. A port of Apache Maven's `ComparableVersion` (maven-artifact 3.9) — keep
 * its quirks. Not exported from the package barrel — tests live in _maven.test.ts.
 */

import type { IncrementType, MavenVersionItem, ParsedMavenVersion } from './types';

/** Known qualifiers, in ascending order; the empty string is the release itself. */
const QUALIFIERS = ['alpha', 'beta', 'milestone', 'rc', 'snapshot', '', 'sp'];
const ALIASES: Record<string, string> = { ga: '', final: '', release: '', cr: 'rc' };
const RELEASE_INDEX = String(QUALIFIERS.indexOf(''));

/** An item while parsing: a mutable list, so a `-` can open a nested one. */
type Item = bigint | string | Item[];

/** A comparable value for a qualifier: known ones by index, unknown ones after them, in lexical order. */
function comparableQualifier(name: string): string {
  const index = QUALIFIERS.indexOf(name);
  return index === -1 ? `${QUALIFIERS.length}-${name}` : String(index);
}

const compareStrings = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** Whether an item is equivalent to nothing (`0`, the release qualifier, an empty list). */
function isNull(item: Item): boolean {
  if (typeof item === 'bigint') return item === 0n;
  if (typeof item === 'string') return comparableQualifier(item) === RELEASE_INDEX;
  return item.length === 0;
}

/** Compares an item to another one, or to the absence of one (`null`). */
function compareItem(item: Item, other: Item | null): number {
  if (typeof item === 'bigint') {
    if (other === null) return item === 0n ? 0 : 1;
    if (typeof other === 'bigint') return item < other ? -1 : item > other ? 1 : 0;
    return 1; // 1.1 > 1-sp and 1.1 > 1-1
  }
  if (typeof item === 'string') {
    if (other === null) return compareStrings(comparableQualifier(item), RELEASE_INDEX);
    if (typeof other === 'string') return compareStrings(comparableQualifier(item), comparableQualifier(other));
    return -1; // 1.any < 1.1 and 1.any < 1-1
  }
  if (other === null) {
    for (const child of item) {
      const result = compareItem(child, null);
      if (result !== 0) return result;
    }
    return 0;
  }
  if (typeof other === 'bigint') return -1; // 1-1 < 1.0.x
  if (typeof other === 'string') return 1; // 1-1 > 1-sp
  for (let i = 0; i < Math.max(item.length, other.length); i++) {
    const left = item[i] ?? null;
    const right = other[i] ?? null;
    // If the left side is shorter, invert the comparison of the right one against nothing.
    const result = left === null ? -compareItem(right!, null) : compareItem(left, right);
    if (result !== 0) return result;
  }
  return 0;
}

/** Drops the trailing null items of a list (`0`, `''`, empty lists), stopping at the first real one. */
function normalize(list: Item[]): void {
  for (let i = list.length - 1; i >= 0; i--) {
    const last = list[i]!;
    if (isNull(last)) list.splice(i, 1);
    else if (!Array.isArray(last)) break;
  }
}

function qualifier(text: string, followedByDigit: boolean): string {
  let value = text;
  if (followedByDigit && value.length === 1) {
    // a1 = alpha-1, b1 = beta-1, m1 = milestone-1
    value = value === 'a' ? 'alpha' : value === 'b' ? 'beta' : value === 'm' ? 'milestone' : value;
  }
  return ALIASES[value] ?? value;
}

function parseItem(isDigit: boolean, text: string): Item {
  return isDigit ? BigInt(text) : qualifier(text, false);
}

/** @ignore */
export function parseMaven(version: string): ParsedMavenVersion {
  const root: Item[] = [];
  const lists: Item[][] = [root];
  let list = root;
  const open = (): void => {
    const child: Item[] = [];
    list.push(child);
    list = child;
    lists.push(list);
  };

  const text = version.toLowerCase();
  let isDigit = false;
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === '.') {
      list.push(i === start ? 0n : parseItem(isDigit, text.slice(start, i)));
      start = i + 1;
    } else if (c === '-') {
      list.push(i === start ? 0n : parseItem(isDigit, text.slice(start, i)));
      start = i + 1;
      open();
    } else if (c >= '0' && c <= '9') {
      if (!isDigit && i > start) {
        // 1.0.0.X1 < 1.0.0-X2: treat .X as -X for any string qualifier X
        if (list.length > 0) open();
        list.push(qualifier(text.slice(start, i), true));
        start = i;
        open();
      }
      isDigit = true;
    } else {
      if (isDigit && i > start) {
        list.push(parseItem(true, text.slice(start, i)));
        start = i;
        open();
      }
      isDigit = false;
    }
  }

  if (text.length > start) {
    if (!isDigit && list.length > 0) open();
    list.push(parseItem(isDigit, text.slice(start)));
  }

  for (const each of lists.toReversed()) normalize(each);
  return { scheme: 'maven', items: root as MavenVersionItem[] };
}

/** @ignore */
export function compareParsedMaven(a: ParsedMavenVersion, b: ParsedMavenVersion): number {
  return compareItem(a.items as Item[], b.items as Item[]);
}

/** @ignore */
export function compareMaven(version1: string, version2: string): number {
  return compareParsedMaven(parseMaven(version1), parseMaven(version2));
}

function stringifyItems(items: readonly MavenVersionItem[]): string {
  let out = '';
  for (const item of items) {
    if (out !== '') out += Array.isArray(item) ? '-' : '.';
    out += Array.isArray(item) ? stringifyItems(item) : String(item);
  }
  return out;
}

/** Maven's canonical form: nested lists after a `-`, everything else after a `.`. @ignore */
export function stringifyMaven(parsed: ParsedMavenVersion): string {
  return stringifyItems(parsed.items);
}

function hasPreQualifier(items: readonly MavenVersionItem[]): boolean {
  return items.some((item) => {
    if (typeof item === 'string') return Number(comparableQualifier(item).split('-')[0]) < Number(RELEASE_INDEX);
    return Array.isArray(item) && hasPreQualifier(item);
  });
}

/**
 * A Maven version is a "prerelease" when it has an `alpha`, `beta`, `milestone`, `rc`/`cr` or
 * `snapshot` qualifier, which all sort below the plain release (`1.0-rc1` < `1.0`).
 * @ignore
 */
export function isPrereleaseMaven(parsed: ParsedMavenVersion): boolean {
  return hasPreQualifier(parsed.items);
}

/**
 * Bumps the leading numeric component at `type`'s position (`major` → 1st, `minor` → 2nd, `patch` →
 * 3rd, padding with zeros), zeroing the rest of the leading numbers and dropping every qualifier.
 * @ignore
 */
export function incrementMaven(version: string, type: IncrementType): string {
  const { items } = parseMaven(version);
  const numbers: bigint[] = [];
  for (const item of items) {
    if (typeof item !== 'bigint') break;
    numbers.push(item);
  }
  while (numbers.length < 3) numbers.push(0n);
  const index = { major: 0, minor: 1, patch: 2 }[type];
  numbers[index] = numbers[index]! + 1n;
  for (let i = index + 1; i < numbers.length; i++) numbers[i] = 0n;
  return numbers.join('.');
}

/** @ignore */
export function incrementPrereleaseMaven(): never {
  throw new Error("incrementPrerelease: Maven qualifiers are free-form (no prerelease counter), so the 'maven' scheme does not support incrementPrerelease");
}

interface Restriction {
  lower: string | null;
  lowerInclusive: boolean;
  upper: string | null;
  upperInclusive: boolean;
}

function parseRestrictions(range: string): Restriction[] {
  const restrictions: Restriction[] = [];
  let rest = range.trim();
  if (rest === '') throw new SyntaxError('satisfiesRange: an empty Maven version range');

  while (rest !== '') {
    const first = rest[0]!;
    if (first !== '[' && first !== '(') {
      // A bare version is a soft requirement in Maven; as a check, it is an exact match.
      const comma = rest.indexOf(',');
      const bare = (comma === -1 ? rest : rest.slice(0, comma)).trim();
      restrictions.push({ lower: bare, lowerInclusive: true, upper: bare, upperInclusive: true });
      rest = comma === -1 ? '' : rest.slice(comma + 1).trim();
      continue;
    }
    const close = rest.search(/[\])]/);
    if (close === -1) throw new SyntaxError(`satisfiesRange: unbounded Maven version range "${range}" (missing ] or ))`);
    const lowerInclusive = first === '[';
    const upperInclusive = rest[close] === ']';
    const inner = rest.slice(1, close);
    const comma = inner.indexOf(',');
    if (comma === -1) {
      if (!lowerInclusive || !upperInclusive) throw new SyntaxError(`satisfiesRange: single version must be surrounded by [], got "${range}"`);
      restrictions.push({ lower: inner.trim(), lowerInclusive, upper: inner.trim(), upperInclusive });
    } else {
      const lower = inner.slice(0, comma).trim() || null;
      const upper = inner.slice(comma + 1).trim() || null;
      if (lower !== null && upper !== null && compareMaven(lower, upper) > 0) {
        throw new SyntaxError(`satisfiesRange: Maven version range "${range}" defies version ordering`);
      }
      restrictions.push({ lower, lowerInclusive, upper, upperInclusive });
    }
    rest = rest.slice(close + 1).trim();
    if (rest.startsWith(',')) rest = rest.slice(1).trim();
  }
  return restrictions;
}

/**
 * A Maven version range: `[1.0,2.0)`, `(,1.0]`, `[1.5]` (exactly 1.5), several joined by commas
 * (`(,1.0],[1.2,)` — a union), or a bare version, which is an exact match here (in a POM it is a
 * "soft" preference).
 * @ignore
 */
export function satisfiesRangeMaven(version: string, range: string): boolean {
  return parseRestrictions(range).some((restriction) => {
    if (restriction.lower !== null) {
      const order = compareMaven(version, restriction.lower);
      if (order < 0 || (order === 0 && !restriction.lowerInclusive)) return false;
    }
    if (restriction.upper !== null) {
      const order = compareMaven(version, restriction.upper);
      if (order > 0 || (order === 0 && !restriction.upperInclusive)) return false;
    }
    return true;
  });
}
