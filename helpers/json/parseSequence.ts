/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link parseSequence} and {@link safeParseSequence}.
 * @since next
 */
export interface ParseSequenceOptions {
  /**
   * What to do with a record that isn't a valid, complete JSON text:
   * - `'fail'` (default) — the whole parse fails, like every other `parse*` helper
   * - `'skip'` — drop that record and keep the others. RFC 7464 recommends this (*"parsers should
   *   not abort when an octet string contains a malformed JSON text"*), for logs whose records
   *   may have been truncated by a crash.
   */
  invalidRecords?: 'fail' | 'skip';
}

/** The ASCII record separator that starts every record of a JSON text sequence. @ignore */
const RECORD_SEPARATOR = '\u001E';

/**
 * JSON whitespace, the only thing that can end a top-level number, `true`, `false` or `null` —
 * without it, RFC 7464 §2.4 says such a record may have been truncated (`123` cut from `1234`).
 * @ignore
 */
const TRAILING_JSON_WHITESPACE = /[ \t\n\r]$/;

/**
 * Parses a JSON text sequence (RFC 7464, `application/json-seq`): records that each start with
 * the ASCII record separator (RS, U+001E) and hold one JSON text, as written by `jq --seq`.
 *
 * **Accepts:**
 * - one strict JSON value per record (each record is read like {@link parseStrict})
 * - JSON values spread over several lines inside a record — unlike {@link parseLines}
 * - several RS in a row (empty records are ignored, as the RFC's grammar allows)
 * - an empty text, which holds zero records
 *
 * **Rejects (as invalid records):**
 * - anything before the first RS
 * - a record that isn't strict JSON, or holds only whitespace
 * - a top-level number, `true`, `false` or `null` not followed by whitespace — RFC 7464 §2.4
 *   requires dropping it, since it may have been truncated
 *
 * **On invalid input:** throws a `SyntaxError` naming the 1-based record number, with the
 * original parse error (if any) as its `cause` — unless `invalidRecords: 'skip'` says to drop it.
 *
 * @param text - The JSON text sequence
 * @param options - How to handle invalid records — see {@link ParseSequenceOptions}
 * @returns The parsed values, in record order, typed as `T[]`
 * @throws {SyntaxError} When a record is invalid and `invalidRecords` is `'fail'`
 * @see {@link safeParseSequence} — same parsing, returns `null` or a fallback instead of throwing
 * @see {@link stringifySequence} — the reverse operation
 * @see {@link parseLines} — newline-delimited JSON (NDJSON, JSON Lines)
 * @example
 * parseSequence('\u001E{"id":1}\n\u001E{"id":2}\n') // => [{ id: 1 }, { id: 2 }]
 * @example
 * // A crash cut the last record: skip it, as RFC 7464 recommends
 * parseSequence('\u001E{"id":1}\n\u001E{"id', { invalidRecords: 'skip' }) // => [{ id: 1 }]
 * @since next
 */
export function parseSequence<T = unknown>(text: string, options: ParseSequenceOptions = {}): T[] {
  const { invalidRecords = 'fail' } = options;
  const [beforeFirst, ...records] = text.split(RECORD_SEPARATOR);

  const invalid = (where: string, reason: string, cause?: unknown): void => {
    if (invalidRecords === 'fail') {
      throw new SyntaxError(`parseSequence: ${where}: ${reason}`, cause === undefined ? undefined : { cause });
    }
  };

  // `split` always returns at least one element, so `beforeFirst` is always a string.
  if (beforeFirst!.trim() !== '') invalid('before the first record', 'text outside any record (missing record separator)');

  const values: T[] = [];
  records.forEach((record, index) => {
    const where = `record ${index + 1}`;
    if (record === '') return;
    let value: unknown;
    try {
      value = JSON.parse(record);
    } catch (error) {
      invalid(where, (error as Error).message, error);
      return;
    }
    const selfDelimited = (typeof value === 'object' && value !== null) || typeof value === 'string';
    if (!selfDelimited && !TRAILING_JSON_WHITESPACE.test(record)) {
      invalid(where, `top-level ${JSON.stringify(value)} is not followed by whitespace and may be truncated`);
      return;
    }
    values.push(value as T);
  });
  return values;
}
