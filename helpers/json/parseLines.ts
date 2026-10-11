/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link parseLines} and {@link safeParseLines}.
 * @since 3.1.3
 */
export interface ParseLinesOptions {
  /**
   * What to do with a blank (empty or whitespace-only) line:
   * - `'skip'` (default) — ignore it, as NDJSON allows
   * - `'fail'` — treat it as invalid, as JSON Lines requires (*"a blank line is not"* a valid value)
   *
   * A single line break at the very end of the text is a terminator, not a blank line, and is
   * always accepted.
   */
  blankLines?: 'skip' | 'fail';
  /**
   * What to do with a line that isn't valid JSON:
   * - `'fail'` (default) — the whole parse fails, as NDJSON says a parser should
   * - `'skip'` — drop that line and keep the others, e.g. for a log whose last line was
   *   truncated by a crash
   */
  invalidLines?: 'fail' | 'skip';
}

/** @ignore */
const LINE_FEED = '\n';

/**
 * Parses newline-delimited JSON — one JSON value per line. Covers both NDJSON
 * (`application/x-ndjson`, `.ndjson`) and JSON Lines (`.jsonl`), which are the same format.
 *
 * **Accepts:**
 * - one strict JSON value per line (each line is read like {@link parseStrict})
 * - `\n` and `\r\n` line endings
 * - a trailing line break after the last value, or none
 * - blank lines, skipped by default (see {@link ParseLinesOptions.blankLines})
 * - an empty text, which holds zero values
 *
 * **Rejects:** comments, trailing commas and any other non-strict JSON on a line, a value spread
 * over several lines, and a leading byte order mark (JSON Lines forbids it).
 *
 * **On invalid input:** throws a `SyntaxError` naming the 1-based line number, with the
 * original parse error as its `cause` — unless `invalidLines`/`blankLines` say to skip it.
 *
 * @param text - The newline-delimited JSON text
 * @param options - How to handle blank and invalid lines — see {@link ParseLinesOptions}
 * @returns The parsed values, in line order, typed as `T[]`
 * @throws {SyntaxError} When a line isn't valid JSON (or is blank with `blankLines: 'fail'`)
 * @see {@link safeParseLines} — same parsing, returns `null` or a fallback instead of throwing
 * @see {@link stringifyLines} — the reverse operation
 * @see {@link parseSequence} — JSON text sequences (RFC 7464), the record-separator variant
 * @see {@link parse} — a single JSON or JSONC value
 * @example
 * parseLines('{"id":1}\n{"id":2}\n') // => [{ id: 1 }, { id: 2 }]
 * @example
 * parseLines('{"id":1}\n{"id":', { invalidLines: 'skip' }) // => [{ id: 1 }]
 * @since 3.1.3
 */
export function parseLines<T = unknown>(text: string, options: ParseLinesOptions = {}): T[] {
  const { blankLines = 'skip', invalidLines = 'fail' } = options;
  if (text === '') return [];

  const lines = text.split(LINE_FEED);
  // A line break after the last value terminates it; it doesn't open an empty last line.
  if (text.endsWith(LINE_FEED)) lines.pop();

  const values: T[] = [];
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.trim() === '') {
      if (blankLines === 'fail') {
        throw new SyntaxError(`parseLines: line ${lineNumber} is blank`);
      }
      return;
    }
    try {
      values.push(JSON.parse(line) as T);
    } catch (error) {
      if (invalidLines === 'fail') {
        throw new SyntaxError(`parseLines: line ${lineNumber}: ${(error as Error).message}`, { cause: error });
      }
    }
  });
  return values;
}
