/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Zero-width space character used as an optional line-break hint.
 * @internal
 */
const ZWS = '\u200B';

/**
 * Identifies whether a group came from a D0 protected span (URL, email, HTML
 * tag, HTML entity) — ZWS is never inserted adjacent to such groups.
 * `atomic` groups (numeric values) are protected from internal splitting but
 * ZWS may still be inserted between them and neighbouring groups.
 * @internal
 */
type GroupKind = 'd0' | 'atomic' | 'regular';

/** @internal */
interface Group {
  text: string;
  kind: GroupKind;
}

// ---------------------------------------------------------------------------
// Compiled patterns (module-level, reset lastIndex before each use)
// ---------------------------------------------------------------------------

/**
 * D0 — Protected spans: URLs, emails, HTML tags, HTML entities (in that order
 * so that a URL containing `@` is never mis-parsed as an email address).
 * @internal
 */
const D0_REGEX =
  /https?:\/\/[^\s<>"{}|\\^[\]`]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|<[^>]*>|&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g;

/**
 * Pass 1 — Atomic value pattern:
 *   [optional sign] [integer or localized integer] [optional decimal]
 *   [optional scientific exponent] [optional unit (letters / % / °)]
 *
 * The integer group requires at least one digit, so the regex can never
 * produce a zero-length match.
 * @internal
 */
const ATOMIC_REGEX =
  /[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?[a-zA-Z%°]*/g;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Splits `text` around every match of `pattern`, returning an array of Groups.
 * Matched substrings are assigned `matchKind`; everything else gets `restKind`.
 * @internal
 */
function splitGroups(
  text: string,
  pattern: RegExp,
  matchKind: GroupKind,
  restKind: GroupKind,
): Group[] {
  const groups: Group[] = [];
  let lastIndex = 0;
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      groups.push({ text: text.slice(lastIndex, match.index), kind: restKind });
    }
    groups.push({ text: match[0], kind: matchKind });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    groups.push({ text: text.slice(lastIndex), kind: restKind });
  }
  return groups;
}

/**
 * Pass 2 — Split `text` into alternating word (`[a-zA-Z0-9_]+`) and
 * non-word segments.
 * @internal
 */
function pass2Split(text: string): string[] {
  const result: string[] = [];
  const wordRegex = /[a-zA-Z0-9_]+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = wordRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    result.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
}

/**
 * Pass 3 — Split a word group at camelCase boundaries (lowercase → uppercase).
 * @internal
 */
function pass3Split(text: string): string[] {
  return text.split(/(?<=[a-z])(?=[A-Z])/);
}

/**
 * Pass 4 (word groups) — Isolate repeated underscore blocks (`__`, `___`, …).
 * @internal
 */
function pass4WordSplit(text: string): string[] {
  return text.split(/(_{2,})/).filter((s) => s.length > 0);
}

/**
 * Pass 4 (non-word groups) — Isolate `/` and `@` as standalone separators.
 * @internal
 */
function pass4NonWordSplit(text: string): string[] {
  return text.split(/([/@])/).filter((s) => s.length > 0);
}

/** Returns true when `text` consists entirely of word characters. @internal */
const isWordGroup = (text: string): boolean => /^[a-zA-Z0-9_]+$/.test(text);

/** Returns true when `text` consists entirely of whitespace. @internal */
const isWhitespace = (text: string): boolean => /^\s+$/.test(text);

/**
 * Trailing punctuation that must be attached to the preceding group so that
 * a line never starts with one of these characters.
 * @internal
 */
const TRAILING_PUNCT = /^[,.:;%)\]}]$/;

/**
 * Leading punctuation that must be attached to the following group so that
 * a line never ends with an "orphan" opening bracket.
 * @internal
 */
const LEADING_PUNCT = /^[([{]$/;

/**
 * Pass 5 — Attach trailing and leading punctuation to their neighbours so
 * that punctuation can never appear at the start of a wrapped line.
 * @internal
 */
function pass5Attach(groups: Group[]): Group[] {
  const result = [...groups];

  // --- Trailing punctuation: attach to the immediate left neighbour ---
  let i = 0;
  while (i < result.length) {
    const g = result[i];
    if (g.kind !== 'd0' && TRAILING_PUNCT.test(g.text)) {
      const prev = i - 1;
      if (prev >= 0) {
        result[prev] = {
          text: result[prev].text + g.text,
          kind: result[prev].kind,
        };
        result.splice(i, 1);
        continue; // re-check same position
      }
    }
    i++;
  }

  // --- Leading punctuation: attach to the immediate right neighbour ---
  i = 0;
  while (i < result.length) {
    const g = result[i];
    if (g.kind !== 'd0' && LEADING_PUNCT.test(g.text)) {
      const next = i + 1;
      if (next < result.length) {
        result[next] = {
          text: g.text + result[next].text,
          kind: result[next].kind,
        };
        result.splice(i, 1);
        continue; // re-check same position
      }
    }
    i++;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// Algorithm overview (for contributors):
//
// injectWordBreaks identifies "groups" (indivisible tokens) through five
// successive splitting passes, then inserts a ZWS (\u200B) at every boundary
// between two adjacent non-whitespace, non-D0 groups.
//
// D0  Protected spans — URLs, emails, HTML tags, HTML entities.
//     Treated as a single group; never split, ZWS never inserted adjacent.
//
// P1  Atomic values — signed numbers, decimals, scientific notation,
//     number+unit (e.g. -0.1%, 1e-3, 12ms, -5°C). Treated as one group;
//     ZWS may appear around them but never inside.
//
// P2  Word / non-word alternation — splits remaining text into runs of
//     [a-zA-Z0-9_]+ (word) and everything else (non-word).
//
// P3  camelCase sub-splitting — word groups are split at every
//     lowercase→uppercase boundary (e.g. getUserProfileData → 4 tokens).
//
// P4  Structural separators — `/` and `@` in non-word groups become their
//     own tokens; repeated underscores (__+) in word groups likewise.
//
// P5  Punctuation attachment:
//       trailing (, . : ; % ) ] }) → appended to the left neighbour
//       leading  ({ [)             → prepended to the right neighbour
//     This prevents a line from ever starting with punctuation.
//
// ZWS Inserted between every pair of adjacent non-whitespace, non-D0 groups.
// ---------------------------------------------------------------------------

/**
 * Adds word-break opportunities to a string so it can wrap cleanly in narrow
 * UI containers such as side panels or table cells.
 *
 * Invisible zero-width spaces (`\u200B`) are inserted at meaningful
 * boundaries — camelCase splits, path separators, token edges — while
 * protected spans (URLs, emails, HTML) and atomic numeric values (`-0.1%`,
 * `12ms`, `1e-3`) are never broken. The visible text content is unchanged.
 *
 * @param str - The string to process.
 * @returns The string with word-break opportunities injected at meaningful
 * boundaries.
 * @example
 * injectWordBreaks('getUserProfileData')
 * // => 'get\u200BUser\u200BProfile\u200BData'  (3 break opportunities)
 *
 * injectWordBreaks('foo,bar')
 * // => 'foo,\u200Bbar'
 *
 * injectWordBreaks('-0.1%')
 * // => '-0.1%'  (atomic value — never split)
 *
 * injectWordBreaks('path/to/my_file')
 * // => 'path\u200B/\u200Bto\u200B/\u200Bmy_file'
 *
 * injectWordBreaks('https://example.com/foo/bar')
 * // => 'https://example.com/foo/bar'  (URL — never split)
 * @since 2.0.0
 */
export function injectWordBreaks(str: string): string;
export function injectWordBreaks(str: undefined): undefined;
export function injectWordBreaks(str: null): null;
export function injectWordBreaks(
  str: string | undefined | null,
): string | undefined | null {
  if (str === undefined || str === null) return str;

  // Zero or one character can never have a break opportunity
  if (str.length < 2) return str;

  // D0 — split into protected and non-protected segments
  const d0Groups = splitGroups(str, D0_REGEX, 'd0', 'regular');

  // Pass 1 — split non-D0 segments by atomic numeric values
  const afterP1: Group[] = [];
  for (const g of d0Groups) {
    if (g.kind !== 'regular') {
      afterP1.push(g);
    } else {
      const atomics = splitGroups(g.text, ATOMIC_REGEX, 'atomic', 'regular');
      for (const a of atomics) {
        afterP1.push(a);
      }
    }
  }

  // Passes 2, 3, 4 — further split regular groups into fine-grained tokens
  const afterP234: Group[] = [];
  for (const g of afterP1) {
    if (g.kind !== 'regular') {
      afterP234.push(g);
      continue;
    }
    const p2 = pass2Split(g.text);
    for (const part of p2) {
      if (isWordGroup(part)) {
        // Pass 3 — camelCase boundaries
        const p3 = pass3Split(part);
        for (const camelPart of p3) {
          // Pass 4 — repeated underscores
          const p4 = pass4WordSplit(camelPart);
          for (const t of p4) {
            afterP234.push({ text: t, kind: 'regular' });
          }
        }
      } else {
        // Pass 4 — isolate / and @ in non-word groups
        const p4 = pass4NonWordSplit(part);
        for (const t of p4) {
          afterP234.push({ text: t, kind: 'regular' });
        }
      }
    }
  }

  // Pass 5 — punctuation attachment
  const finalGroups = pass5Attach(afterP234);

  // ZWS insertion — between every pair of adjacent non-whitespace,
  // non-D0-protected groups. Use a parts array to avoid quadratic
  // string reallocation when building the output.
  const parts: string[] = [];
  for (let i = 0; i < finalGroups.length; i++) {
    parts.push(finalGroups[i].text);
    if (i < finalGroups.length - 1) {
      const curr = finalGroups[i];
      const next = finalGroups[i + 1];
      if (
        !isWhitespace(curr.text) &&
        !isWhitespace(next.text) &&
        curr.kind !== 'd0' &&
        next.kind !== 'd0'
      ) {
        parts.push(ZWS);
      }
    }
  }

  return parts.join('');
}
