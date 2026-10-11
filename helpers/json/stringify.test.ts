/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stringify } from './stringify';

describe('stringify', () => {
  const value = { b: 1, a: [true, null] };

  it('indents with 2 spaces by default', () => {
    expect(stringify(value)).toBe(JSON.stringify(value, null, 2));
  });

  it('indents with the given number of spaces', () => {
    expect(stringify(value, { indent: 4 })).toBe(JSON.stringify(value, null, 4));
  });

  it('writes a compact single line with indent 0', () => {
    expect(stringify(value, { indent: 0 })).toBe('{"b":1,"a":[true,null]}');
  });

  it('defaults the indent when the object leaves it out', () => {
    expect(stringify(value, {})).toBe(JSON.stringify(value, null, 2));
  });

  it('writes canonical JSON', () => {
    expect(stringify(value, 'canonical')).toBe('{"a":[true,null],"b":1}');
  });

  it.each([-1, 11, 1.5, Number.NaN])('throws a RangeError on indent %d', (indent) => {
    expect(() => stringify(value, { indent })).toThrow(RangeError);
  });

  it.each([10, 0])('accepts indent %d', (indent) => {
    expect(() => stringify(value, { indent })).not.toThrow();
  });

  it.each([undefined, () => 1, Symbol('s')])('throws a TypeError when the value itself is %s', (input) => {
    expect(() => stringify(input)).toThrow(/has no JSON representation/);
    expect(() => stringify(input, 'canonical')).toThrow(TypeError);
  });

  it('turns NaN into null outside canonical mode, like JSON.stringify', () => {
    expect(stringify([Number.NaN], { indent: 0 })).toBe('[null]');
  });

  it('throws a RangeError on NaN in canonical mode', () => {
    expect(() => stringify([Number.NaN], 'canonical')).toThrow(RangeError);
  });

  it('throws a TypeError on a circular structure or a BigInt', () => {
    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    expect(() => stringify(cycle)).toThrow(TypeError);
    expect(() => stringify(1n)).toThrow(TypeError);
  });
});
