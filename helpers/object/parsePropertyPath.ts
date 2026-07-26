/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

// `g` flag: stateful — callers must reset lastIndex before each use.
const BRACKET = /\[(\d+)\]/g;

// Cache parsed paths: real-world callers (get/set) tend to reuse a small, fixed
// set of literal path strings repeatedly, so parsing the same string on every
// call is pure waste. Capped so a caller who *does* build many distinct,
// dynamic path strings can't grow this into an unbounded memory leak.
const MAX_CACHE_SIZE = 500;
const pathCache = /* @__PURE__ */ new Map<string, readonly (string | number)[]>();

/**
 * Parses a dot/bracket-notation property path into an array of string/number
 * key segments — the same notation accepted by {@link get} and {@link set}.
 *
 * - Dot separators (`.`) split segments; each segment becomes a string key.
 * - Bracket indices (`[n]`) become number keys.
 * - A leading `.` is treated as "current level" and stripped before parsing,
 *   so `.[0]` ≡ `[0]` and `.a.b` ≡ `a.b`.
 * - Empty string (or a bare `.`) returns `['']` (addresses the `''` key on the root object).
 * - Consecutive dots (`a..b`) produce an empty-string segment: `['a', '', 'b']`.
 *
 * Results are cached (up to 500 distinct path strings, oldest evicted first)
 * since real-world callers tend to reuse a small, fixed set of literal paths.
 *
 * @param path - The dot/bracket-notation path string to parse
 * @returns The parsed key segments
 * @throws {RangeError} When non-bracket text trails the last `]` within a
 *   dot-segment (e.g. `'a[0]b'` is ambiguous — use `'a[0].b'` instead)
 * @example
 * parsePropertyPath('a.b.c')       // => ['a', 'b', 'c']
 * parsePropertyPath('layers[1].x') // => ['layers', 1, 'x']
 * parsePropertyPath('.[0]')        // => [0]              (leading dot stripped)
 * parsePropertyPath('a..b')        // => ['a', '', 'b']   (empty segment preserved)
 * @since 3.0.0
 */
export function parsePropertyPath(path: string): readonly (string | number)[] {
  const cached = pathCache.get(path);
  if (cached !== undefined) return cached;

  const result = Object.freeze(parseUncached(path));

  // MAX_CACHE_SIZE is a fixed positive constant, so size >= MAX_CACHE_SIZE always
  // implies the cache is non-empty — the iterator's first key is never undefined here.
  if (pathCache.size >= MAX_CACHE_SIZE) {
    pathCache.delete(pathCache.keys().next().value!);
  }
  pathCache.set(path, result);

  return result;
}

function parseUncached(path: string): (string | number)[] {
  if (path === '') return [''];
  if (path[0] === '.') path = path.slice(1);
  if (path === '') return [''];
  const result: (string | number)[] = [];
  // Split on `.` first so consecutive dots produce empty segments, then parse `[n]` within each.
  for (const dotSegment of path.split('.')) {
    BRACKET.lastIndex = 0;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = BRACKET.exec(dotSegment)) !== null) {
      // String prefix before this [n] — omit only when the segment starts with '['.
      if (match.index > last) result.push(dotSegment.slice(last, match.index));
      result.push(parseInt(match[1], 10));
      last = BRACKET.lastIndex;
    }
    if (last === 0) {
      // No brackets found — push the whole dot-segment as a string key.
      result.push(dotSegment);
    } else if (last < dotSegment.length) {
      // Trailing non-bracket text after the last ']' (e.g. 'a[0]b') — ambiguous and
      // almost always a mistake. Throw rather than silently drop 'b'.
      throw new RangeError(
        `parsePropertyPath: non-bracket text '${dotSegment.slice(last)}' after ']' in segment '${dotSegment}' — use 'a[0].b' instead of 'a[0]b'`,
      );
    }
    // last === dotSegment.length: segment ended right after the last ']', nothing to push.
  }
  return result;
}
