/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stringifyLines } from './stringifyLines';

describe('stringifyLines', () => {
  it('writes one compact value per line, each followed by a line break', () => {
    expect(stringifyLines([{ id: 1 }, [2], 'three', null])).toBe('{"id":1}\n[2]\n"three"\nnull\n');
  });

  it('writes an empty text for an empty array', () => {
    expect(stringifyLines([])).toBe('');
  });

  it('writes canonical JSON lines', () => {
    expect(stringifyLines([{ b: 1, a: 2 }], 'canonical')).toBe('{"a":2,"b":1}\n');
  });

  it('escapes line breaks inside strings, so a value stays on one line', () => {
    expect(stringifyLines(['a\nb\rc'])).toBe('"a\\nb\\rc"\n');
  });

  it('throws a TypeError on a value with no JSON representation, naming its index', () => {
    expect(() => stringifyLines([1, undefined])).toThrow('stringifyLines: the value at index 1 (undefined) has no JSON representation');
    expect(() => stringifyLines([() => 1], 'canonical')).toThrow(TypeError);
  });

  it.each([null, 'text', { 0: 1 }])('throws a TypeError when values is not an array (%j)', (values) => {
    expect(() => stringifyLines(values as unknown as unknown[])).toThrow(/expected an array/);
  });
});
