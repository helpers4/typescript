/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stripJsonComments } from './_stripJsonComments';

describe('stripJsonComments', () => {
  it('leaves plain JSON untouched', () => {
    const json = '{"a":1,"b":[1,2,3]}';
    expect(JSON.parse(stripJsonComments(json))).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it('strips a line comment', () => {
    const jsonc = '{\n  "a": 1 // the answer\n}';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ a: 1 });
  });

  it('strips a line comment on its own line', () => {
    const jsonc = '{\n  // leading comment\n  "a": 1\n}';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ a: 1 });
  });

  it('strips a block comment', () => {
    const jsonc = '{ /* inline */ "a": 1 }';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ a: 1 });
  });

  it('strips a multi-line block comment', () => {
    const jsonc = '{\n  /*\n   * a is the answer\n   */\n  "a": 1\n}';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ a: 1 });
  });

  it('strips a trailing comma in an object', () => {
    expect(JSON.parse(stripJsonComments('{"a":1,"b":2,}'))).toEqual({ a: 1, b: 2 });
  });

  it('strips a trailing comma in an array', () => {
    expect(JSON.parse(stripJsonComments('[1,2,3,]'))).toEqual([1, 2, 3]);
  });

  it('strips a trailing comma followed by whitespace before the close', () => {
    expect(JSON.parse(stripJsonComments('{"a":1,\n}'))).toEqual({ a: 1 });
  });

  it('strips a trailing comma followed by a comment before the close', () => {
    expect(JSON.parse(stripJsonComments('{"a":1, // trailing\n}'))).toEqual({ a: 1 });
  });

  it('does not touch a non-trailing comma', () => {
    expect(JSON.parse(stripJsonComments('[1, /* keep going */ 2]'))).toEqual([1, 2]);
  });

  it('does not strip // inside a string (e.g. a URL)', () => {
    const jsonc = '{"url":"http://example.com"}';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ url: 'http://example.com' });
  });

  it('does not strip /* inside a string', () => {
    const jsonc = '{"note":"see /* this */ literally"}';
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ note: 'see /* this */ literally' });
  });

  it('does not strip a comma inside a string', () => {
    expect(JSON.parse(stripJsonComments('{"csv":"a,b,c"}'))).toEqual({ csv: 'a,b,c' });
  });

  it('does not treat a closing bracket inside a string as structural', () => {
    expect(JSON.parse(stripJsonComments('{"arr":"[not, an, array]"}'))).toEqual({
      arr: '[not, an, array]',
    });
  });

  it('handles an escaped quote inside a string without ending it early', () => {
    const jsonc = String.raw`{"quote":"she said \"hi\""}`;
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ quote: 'she said "hi"' });
  });

  it('handles an escaped backslash right before the closing quote', () => {
    const jsonc = String.raw`{"path":"C:\\"}`;
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({ path: 'C:\\' });
  });

  it('handles multiple comments and trailing commas together (tsconfig-style)', () => {
    const jsonc = `{
      // compiler options
      "compilerOptions": {
        "strict": true, /* enable all strict checks */
        "target": "ES2022",
      },
    }`;
    expect(JSON.parse(stripJsonComments(jsonc))).toEqual({
      compilerOptions: { strict: true, target: 'ES2022' },
    });
  });

  it('handles an empty string', () => {
    expect(stripJsonComments('')).toBe('');
  });

  it('handles a comment that runs to the end of input with no trailing newline', () => {
    expect(JSON.parse(stripJsonComments('{"a":1} // trailing comment, no newline'))).toEqual({
      a: 1,
    });
  });

  it('handles a backslash as the very last character (truncated input)', () => {
    // Malformed/truncated input — no closing quote or char after the escape.
    // Must not throw or read past the end of the string.
    expect(() => stripJsonComments('{"a":"end\\')).not.toThrow();
  });

  it('handles an unterminated block comment gracefully (no infinite loop)', () => {
    // Malformed input — JSON.parse on the result will fail, but stripJsonComments
    // itself must still terminate rather than looping forever.
    expect(() => stripJsonComments('{"a":1} /* never closed')).not.toThrow();
  });
});
