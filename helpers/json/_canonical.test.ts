/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stringifyCanonical } from './_canonical';

describe('stringifyCanonical', () => {
  it('matches the RFC 8785 §3.2.2 example', () => {
    const input = JSON.parse(
      '{"numbers":[333333333.33333329,1E30,4.50,2e-3,0.000000000000000000000000001],' +
        '"string":"\\u20ac$\\u000F\\u000aA\'\\u0042\\u0022\\u005c\\\\\\"\\/",' +
        '"literals":[null,true,false]}',
    );
    expect(stringifyCanonical(input)).toBe(
      '{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],' +
        '"string":"€$\\u000f\\nA\'B\\"\\\\\\\\\\"/"}',
    );
  });

  it('sorts keys by UTF-16 code units, integer-like keys included (RFC 8785 §3.2.3)', () => {
    const input = {
      '\u20ac': 'Euro Sign',
      '\r': 'Carriage Return',
      '\ufb33': 'Hebrew Letter Dalet With Dagesh',
      '1': 'One',
      '\ud83d\ude00': 'Emoji: Grinning Face',
      '\u0080': 'Control',
      '\u00f6': 'Latin Small Letter O With Diaeresis',
    };
    const keys = Object.keys(JSON.parse(stringifyCanonical(input)!) as object);
    // JSON.parse puts the integer key first again, so compare the order in the text instead.
    const text = stringifyCanonical(input)!;
    const order = ['\\r', '"1"', '\u0080', '\u00f6', '\u20ac', '\ud83d\ude00', '\ufb33'].map((key) => text.indexOf(key));
    expect(order).toEqual([...order].toSorted((a, b) => a - b));
    expect(keys).toHaveLength(7);
  });

  it.each([
    [0, '0'],
    [-0, '0'],
    [5e-324, '5e-324'],
    [-5e-324, '-5e-324'],
    [1.7976931348623157e308, '1.7976931348623157e+308'],
    [9007199254740992, '9007199254740992'],
    [295147905179352830000, '295147905179352830000'],
    [1e23, '1e+23'],
    [0.000001, '0.000001'],
    [333333333.3333332, '333333333.3333332'],
    [1e21, '1e+21'],
    [1e-7, '1e-7'],
  ])('writes the number %d as %s (RFC 8785 Appendix B)', (value, expected) => {
    expect(stringifyCanonical(value)).toBe(expected);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('throws a RangeError on %d', (value) => {
    expect(() => stringifyCanonical([value])).toThrow(RangeError);
  });

  it('throws a RangeError on a lone surrogate in a string or a key', () => {
    expect(() => stringifyCanonical('\ud800')).toThrow(RangeError);
    expect(() => stringifyCanonical('a\udc00')).toThrow(RangeError);
    expect(() => stringifyCanonical({ '\ud800': 1 })).toThrow(RangeError);
  });

  it('accepts a well-formed surrogate pair', () => {
    expect(stringifyCanonical('\ud83d\ude00')).toBe('"\ud83d\ude00"');
  });

  it('follows JSON.stringify for undefined, functions and symbols', () => {
    expect(stringifyCanonical({ a: undefined, b: () => 1, c: Symbol('c'), d: 1 })).toBe('{"d":1}');
    expect(stringifyCanonical([undefined, () => 1, Symbol('c')])).toBe('[null,null,null]');
    expect(stringifyCanonical(undefined)).toBeUndefined();
  });

  it('calls toJSON with the key, like JSON.stringify', () => {
    const keys: string[] = [];
    const value = { toJSON: (key: string) => { keys.push(key); return 'v'; } };
    expect(stringifyCanonical({ x: value, y: [value] })).toBe('{"x":"v","y":["v"]}');
    expect(keys).toEqual(['x', '0']);
    expect(stringifyCanonical(new Date(0))).toBe('"1970-01-01T00:00:00.000Z"');
  });

  it('unwraps Number, String and Boolean objects', () => {
    // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
    expect(stringifyCanonical([new Number(1), new String('s'), new Boolean(false)])).toBe('[1,"s",false]');
  });

  it('throws a TypeError on a BigInt, unless it has a toJSON', () => {
    expect(() => stringifyCanonical({ a: 1n })).toThrow(TypeError);
    const withToJSON = Object.assign(Object(2n) as object, { toJSON: () => '2' });
    expect(stringifyCanonical(withToJSON)).toBe('"2"');
  });

  it('throws a TypeError on a circular structure', () => {
    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    expect(() => stringifyCanonical(cycle)).toThrow(TypeError);
    const arrayCycle: unknown[] = [];
    arrayCycle.push(arrayCycle);
    expect(() => stringifyCanonical(arrayCycle)).toThrow(TypeError);
  });

  it('accepts the same object twice when it is not a cycle', () => {
    const shared = { a: 1 };
    expect(stringifyCanonical({ x: shared, y: shared })).toBe('{"x":{"a":1},"y":{"a":1}}');
  });

  it('writes nested empty containers', () => {
    expect(stringifyCanonical({ a: [], b: {} })).toBe('{"a":[],"b":{}}');
  });
});
