/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Parses a string path into an array of string/number segments.
 *
 * - Dot separators (`.`) split segments; each segment becomes a string key.
 * - Bracket indices (`[n]`) become number keys.
 * - A leading `.` is treated as "current level" and stripped before parsing,
 *   so `.[0]` ≡ `[0]` and `.a.b` ≡ `a.b`.
 * - Empty string (or bare `.`) returns `['']` (addresses the `''` key on the root object).
 * - Consecutive dots (`a..b`) produce an empty-string segment: `['a', '', 'b']`.
 * - Non-bracket text trailing a `]` within the same dot-segment throws a RangeError;
 *   use a dot separator instead (`'a[0].b'` not `'a[0]b'`).
 *
 * @ignore
 * @example
 * parsePath('a.b.c')       // => ['a', 'b', 'c']        (all strings)
 * parsePath('layers.1.x')  // => ['layers', '1', 'x']   (all strings)
 * parsePath('layers[1].x') // => ['layers', 1, 'x']     (bracket → number)
 * parsePath('.[0]')        // => [0]                     (leading dot stripped)
 * parsePath('a..b')        // => ['a', '', 'b']          (empty segment preserved)
 * parsePath('.')           // => ['']                    (leading dot → empty-string key)
 */
// `g` flag: stateful — callers must reset lastIndex before each use.
const BRACKET = /\[(\d+)\]/g;

// Module-level cache: most call sites use a fixed set of string paths (e.g. sort keys),
// so parsing the same path string repeatedly on every get()/set() call is pure waste.
const parsePathCache = new Map<string, readonly (string | number)[]>();

export function parsePath(path: string): readonly (string | number)[] {
  const cached = parsePathCache.get(path);
  if (cached !== undefined) return cached;

  const result = Object.freeze(parsePathUncached(path));
  parsePathCache.set(path, result);
  return result;
}

function parsePathUncached(path: string): (string | number)[] {
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
        `parsePath: non-bracket text '${dotSegment.slice(last)}' after ']' in segment '${dotSegment}' — use 'a[0].b' instead of 'a[0]b'`,
      );
    }
    // last === dotSegment.length: segment ended right after the last ']', nothing to push.
  }
  return result;
}
