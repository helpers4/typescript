/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helper used by safeReadJsonFile.ts to support JSONC (JSON with
 * line and block comments, plus trailing commas) — the dialect used by
 * tsconfig.json, VS Code's settings.json, etc. Not exported from the package
 * barrel — tests live in _stripJsonComments.test.ts.
 */

/**
 * Strips line comments (starting with two slashes), block comments (slash-star
 * ... star-slash), and trailing commas (before `}` or `]`) from a JSONC
 * string, so the result can be safely passed to `JSON.parse`. String literals
 * are tracked so a comment-like or comma character occurring *inside* a JSON
 * string (e.g. a URL) is left untouched — this is a string-boundary-aware
 * pass, not a naive regex strip.
 * @ignore
 */
export function stripJsonComments(input: string): string {
  let output = '';
  let inString = false;
  // A comma seen outside a string is held back instead of emitted immediately:
  // if the next significant token turns out to be `}`/`]`, it was a trailing
  // comma and gets dropped; otherwise it (and any whitespace/comments held
  // alongside it) is flushed once a real token confirms it wasn't trailing.
  let pendingComma = '';
  const flushPendingComma = () => {
    if (pendingComma) {
      output += pendingComma;
      pendingComma = '';
    }
  };

  let i = 0;
  while (i < input.length) {
    const char = input[i];

    if (inString) {
      output += char;
      if (char === '\\') {
        // Copy the escaped character as-is (whatever it is) so an escaped
        // quote (`\"`) doesn't get mistaken for the string's end.
        i++;
        if (i < input.length) output += input[i];
      } else if (char === '"') {
        inString = false;
      }
      i++;
      continue;
    }

    if (char === '"') {
      flushPendingComma();
      inString = true;
      output += char;
      i++;
      continue;
    }

    if (char === '/' && input[i + 1] === '/') {
      i += 2;
      // Stop at any line-ending character, not just \n — a bare \r (classic
      // Mac line endings, or a lone \r before a later \n) also ends the line,
      // otherwise everything up to the next \n (or EOF) gets silently eaten.
      while (i < input.length && input[i] !== '\n' && input[i] !== '\r') i++;
      continue;
    }

    if (char === '/' && input[i + 1] === '*') {
      i += 2;
      while (i < input.length && !(input[i] === '*' && input[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    if (char === ',') {
      flushPendingComma();
      pendingComma = char;
      i++;
      continue;
    }

    if (char === '}' || char === ']') {
      pendingComma = ''; // drop — it was trailing
      output += char;
      i++;
      continue;
    }

    if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      // Whitespace doesn't resolve a pending comma either way — buffer it
      // alongside so it's dropped too if the comma turns out to be trailing.
      if (pendingComma) {
        pendingComma += char;
      } else {
        output += char;
      }
      i++;
      continue;
    }

    flushPendingComma();
    output += char;
    i++;
  }

  flushPendingComma();
  return output;
}
