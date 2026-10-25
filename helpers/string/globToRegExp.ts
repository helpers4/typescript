/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escapeRegExp } from './escapeRegExp';

/**
 * Options for {@link globToRegExp}.
 * @since next
 */
export interface GlobOptions {
  /** Whether the resulting `RegExp` is case-sensitive. Defaults to `true`. */
  caseSensitive?: boolean;
  /**
   * Reads the pattern as a path glob instead of the two textbook wildcards. Defaults to `false`.
   *
   * - `*` and `?` stop at a `/`; `**` crosses it, and a `**` followed by a slash may also match no
   *   directory at all (so `src/` + `**` + `/*.ts` matches `src/a.ts`);
   * - `{a,b}` is an alternation, nestable (`{a,b{c,d}}`), and needs a comma to be one: `{a}`
   *   and an unclosed `{` are literal;
   * - `[abc]`, `[a-z]` and `[!abc]` (or `[^abc]`) are character classes; a class that is not
   *   closed, or whose range is out of order, is read literally;
   * - `\\` escapes the next character.
   */
  extended?: boolean;
}

function toClass(pattern: string, from: number): { source: string; end: number } | null {
  let i = from + 1;
  const negated = pattern[i] === '!' || pattern[i] === '^';
  if (negated) i++;
  const first = i;
  let body = '';
  for (; i < pattern.length; i++) {
    const c = pattern[i]!;
    if (c === ']' && i > first) {
      const source = `[${negated ? '^/' : ''}${body}]`;
      try {
        new RegExp(source).test('');
      } catch {
        return null;
      }
      return { source, end: i };
    }
    body += c === '\\' && i + 1 < pattern.length ? `\\${pattern[++i]}` : c === ']' || c === '[' || c === '^' ? `\\${c}` : c;
  }
  return null;
}

function braceGroups(pattern: string): { opens: Set<number>; closes: Set<number>; commas: Set<number> } {
  const opens = new Set<number>();
  const closes = new Set<number>();
  const commas = new Set<number>();
  const stack: { open: number; commas: number[] }[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === '\\') i++;
    else if (c === '{') stack.push({ open: i, commas: [] });
    else if (c === ',') stack.at(-1)?.commas.push(i);
    else if (c === '}') {
      const group = stack.pop();
      if (group && group.commas.length > 0) {
        opens.add(group.open);
        closes.add(i);
        for (const comma of group.commas) commas.add(comma);
      }
    }
  }
  return { opens, closes, commas };
}

function extendedBody(pattern: string): string {
  const { opens, closes, commas } = braceGroups(pattern);
  let depth = 0;
  let body = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i]!;
    if (c === '\\' && i + 1 < pattern.length) body += escapeRegExp(pattern[++i]!);
    else if (c === '*') {
      let end = i;
      while (pattern[end + 1] === '*') end++;
      if (end === i) body += '[^/]*';
      else if (pattern[end + 1] === '/' && (i === 0 || pattern[i - 1] === '/')) {
        body += '(?:.*/)?';
        end++;
      } else body += '.*';
      i = end;
    } else if (c === '?') body += '[^/]';
    else if (c === '[') {
      const cls = toClass(pattern, i);
      if (cls) {
        body += cls.source;
        i = cls.end;
      } else body += '\\[';
    } else if (c === '{' && opens.has(i)) {
      body += '(?:';
      depth++;
    } else if (c === '}' && closes.has(i)) {
      body += ')';
      depth--;
    } else if (c === ',' && depth > 0 && commas.has(i)) body += '|';
    else body += escapeRegExp(c);
  }
  return body;
}

/**
 * Compiles a glob pattern into a `RegExp` that matches the whole string. By default only the two
 * textbook wildcards are special: `*` matches any sequence of UTF-16 code units (including
 * none), `?` matches exactly one UTF-16 code unit, and everything else is matched literally.
 * Pass `{ extended: true }` for path globs: `{a,b}`, `[abc]` and a `**` that crosses `/` while
 * `*` and `?` do not — see {@link GlobOptions}.
 *
 * Like the rest of this library, lengths are counted in UTF-16 code units: `?` matches one code
 * unit, not one Unicode code point, so it matches only half of a surrogate pair (e.g. an emoji
 * outside the Basic Multilingual Plane).
 * @param pattern - The glob pattern to compile
 * @param options - Case sensitivity, or {@link GlobOptions}. A boolean is the case sensitivity (defaults to `true`).
 * @returns A `RegExp` matching strings that satisfy `pattern` in full
 * @example
 * globToRegExp('*.test.ts').test('helper.test.ts')
 * // => true
 * @example
 * globToRegExp('report-????.csv').test('report-2026.csv')
 * // => true
 * @example
 * globToRegExp('src/**', { extended: true }).test('src/ui/App.tsx')
 * // => true
 * @since 3.1.1
 */
export function globToRegExp(pattern: string, options: boolean | GlobOptions = true): RegExp {
  const { caseSensitive = true, extended = false } = typeof options === 'boolean' ? { caseSensitive: options } : options;
  const body = extended
    ? extendedBody(pattern)
    : pattern
        .split(/([*?])/)
        .map((segment) => (segment === '*' ? '.*' : segment === '?' ? '.' : escapeRegExp(segment)))
        .join('');

  return new RegExp(`^${body}$`, caseSensitive ? '' : 'i');
}
