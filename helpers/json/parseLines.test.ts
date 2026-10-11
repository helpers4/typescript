/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseLines } from './parseLines';

describe('parseLines', () => {
  it('parses one value per line', () => {
    expect(parseLines('{"id":1}\n[2]\n"three"\n4\nnull')).toEqual([{ id: 1 }, [2], 'three', 4, null]);
  });

  it('accepts a trailing line break, or none', () => {
    expect(parseLines('1\n2\n')).toEqual([1, 2]);
    expect(parseLines('1\n2')).toEqual([1, 2]);
  });

  it('accepts CRLF line endings', () => {
    expect(parseLines('1\r\n2\r\n')).toEqual([1, 2]);
  });

  it('returns an empty array for an empty text', () => {
    expect(parseLines('')).toEqual([]);
  });

  it('skips blank lines by default', () => {
    expect(parseLines('1\n\n  \n2\n')).toEqual([1, 2]);
  });

  it('fails on a blank line with blankLines: "fail"', () => {
    expect(() => parseLines('1\n\n2', { blankLines: 'fail' })).toThrow('parseLines: line 2 is blank');
  });

  it('does not count the final line break as a blank line', () => {
    expect(parseLines('1\n2\n', { blankLines: 'fail' })).toEqual([1, 2]);
  });

  it('fails on an invalid line by default, naming the line and keeping the cause', () => {
    let error: unknown;
    try {
      parseLines('1\n{"a":\n3');
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(SyntaxError);
    expect((error as Error).message).toMatch(/^parseLines: line 2: /);
    expect((error as Error).cause).toBeInstanceOf(SyntaxError);
  });

  it('skips invalid lines with invalidLines: "skip"', () => {
    expect(parseLines('1\n{"a":\n3', { invalidLines: 'skip' })).toEqual([1, 3]);
  });

  it('rejects a value spread over several lines', () => {
    expect(() => parseLines('{\n"a": 1\n}')).toThrow(SyntaxError);
  });

  it('rejects comments and other non-strict JSON on a line', () => {
    expect(() => parseLines('{"a":1} // c')).toThrow(SyntaxError);
  });

  it('rejects a leading byte order mark', () => {
    expect(() => parseLines('\ufeff1\n')).toThrow('line 1');
  });
});
