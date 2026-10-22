/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { readJson } from './_jsonReader';

const json5 = (text: string) => readJson(text, { dialect: 'json5' });
const json = (text: string) => readJson(text, { dialect: 'json' });
const iJson = (text: string) => readJson(text, { dialect: 'json', iJson: true });

describe('readJson \u2014 json5 dialect', () => {
  it.each([
    ['null', null],
    ['true', true],
    ['false', false],
    ['{}', {}],
    ['[]', []],
    ['{ a: 1, "b": 2, \'c\': 3, }', { a: 1, b: 2, c: 3 }],
    ['[1, [2, [3,],],]', [1, [2, [3]]]],
    ['{ $a: 1, _b: 2, \\u0061c: 3, caf\\u00e9: 4, \u00E9t\u00E9: 5, a\u200Cb: 6 }', { $a: 1, _b: 2, ac: 3, 'caf\u00E9': 4, '\u00E9t\u00E9': 5, 'a\u200Cb': 6 }],
    ['{ \uD835\uDCB3: 1 }', { '\uD835\uDCB3': 1 }],
    ['{ if: 1, null: 2, true: 3 }', { if: 1, null: 2, true: 3 }],
  ])('reads %j', (text, expected) => {
    expect(json5(text)).toEqual(expected);
  });

  it.each([
    ['0', 0],
    ['-0', -0],
    ['+1', 1],
    ['1.', 1],
    ['.5', 0.5],
    ['-.5', -0.5],
    ['1e3', 1000],
    ['1E+3', 1000],
    ['1e-3', 0.001],
    ['0x1F', 31],
    ['0XaB', 171],
    ['-0x10', -16],
    ['+0x10', 16],
    ['Infinity', Infinity],
    ['-Infinity', -Infinity],
    ['+Infinity', Infinity],
  ])('reads the number %s', (text, expected) => {
    expect(Object.is(json5(text), expected)).toBe(true);
  });

  it.each(['NaN', '-NaN', '+NaN'])('reads %s as NaN', (text) => {
    expect(json5(text)).toBeNaN();
  });

  it.each([
    ["'single'", 'single'],
    ['"double"', 'double'],
    ["'it\\'s'", "it's"],
    ['"say \\"hi\\""', 'say "hi"'],
    ["'\"'", '"'],
    ['"\'"', "'"],
    ['"\\b\\f\\n\\r\\t\\v\\0\\/\\\\"', '\b\f\n\r\t\v\0/\\'],
    ['"\\x41\\u0042"', 'AB'],
    ['"\\a\\c\\ \\%"', 'ac %'],
    ['"a\\\nb"', 'ab'],
    ['"a\\\r\nb"', 'ab'],
    ['"a\\\rb"', 'ab'],
    ['"a\\\u2028b\\\u2029c"', 'abc'],
    ['"a\u2028b\u2029c"', 'a\u2028b\u2029c'],
    ['"tab\there"', 'tab\there'],
    ['"\\\uD83D\uDE00"', '\uD83D\uDE00'],
  ])('reads the string %j', (text, expected) => {
    expect(json5(text)).toBe(expected);
  });

  it('skips every kind of JSON5 whitespace and comment', () => {
    expect(json5('\uFEFF\t\v\f \u00A0\u1680\u3000\u2028\u2029\r\n// line\r/* block\n */1// end')).toBe(1);
    expect(json5('[1 // a\u2028, 2]')).toEqual([1, 2]);
  });

  it('defines a __proto__ key as an own property, like JSON.parse', () => {
    const result = json5('{ __proto__: { polluted: true } }') as Record<string, unknown>;
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('keeps the last of duplicate keys, like JSON.parse', () => {
    expect(json5('{ a: 1, a: 2 }')).toEqual({ a: 2 });
  });

  it.each([
    ['', 'unexpected end of input at line 1, column 1'],
    ['   ', 'unexpected end of input at line 1, column 4'],
    ['[1,,]', 'unexpected character "," at line 1, column 4'],
    ['{a:1,,}', 'unexpected character "," at line 1, column 6'],
    ['01', 'unexpected character "1" at line 1, column 2'],
    ['1 2', 'unexpected character "2" at line 1, column 3'],
    ['.', 'unexpected end of input at line 1, column 2'],
    ['-', 'unexpected end of input at line 1, column 2'],
    ['+', 'unexpected end of input at line 1, column 2'],
    ['1e', 'unexpected end of input at line 1, column 3'],
    ['1e+', 'unexpected end of input at line 1, column 4'],
    ['0x', 'unexpected end of input at line 1, column 3'],
    ['0xG', 'unexpected character "G" at line 1, column 3'],
    ['Infinit', 'unexpected character "I" at line 1, column 1'],
    ['tru', 'unexpected end of input at line 1, column 4'],
    ['nul!', 'unexpected character "!" at line 1, column 4'],
    ['undefined', 'unexpected character "u" at line 1, column 1'],
    ['"abc', 'unterminated string at line 1, column 1'],
    ["'a\nb'", 'unexpected character "\\n" at line 1, column 3'],
    ['"a\rb"', 'unexpected character "\\r" at line 1, column 3'],
    ['"\\1"', 'unexpected character "1" at line 1, column 3'],
    ['"\\01"', 'unexpected character "1" at line 1, column 4'],
    ['"\\x4"', 'unexpected character "\\"" at line 1, column 5'],
    ['"\\u12G4"', 'unexpected character "G" at line 1, column 6'],
    ['"\\', 'unexpected end of input at line 1, column 3'],
    ['"\\u12', 'unexpected end of input at line 1, column 6'],
    ['/* open', 'unterminated block comment at line 1, column 1'],
    ['{ my-key: 1 }', 'unexpected character "-" at line 1, column 5'],
    ['{ 1a: 1 }', 'unexpected character "1" at line 1, column 3'],
    ['{ \\x61: 1 }', 'unexpected character "x" at line 1, column 4'],
    ['{ \\u0031a: 1 }', 'invalid key character "1" at line 1, column 3'],
    ['{ a\\u002Db: 1 }', 'invalid key character "-" at line 1, column 4'],
    ['{ a 1 }', 'unexpected character "1" at line 1, column 5'],
    ['{ a: 1 b: 2 }', 'unexpected character "b" at line 1, column 8'],
    ['[1 2]', 'unexpected character "2" at line 1, column 4'],
    ['{', 'unexpected end of input at line 1, column 2'],
    ['[', 'unexpected end of input at line 1, column 2'],
  ])('rejects %j: %s', (text, message) => {
    expect(() => json5(text)).toThrow(new SyntaxError(`parse: ${message}`));
  });

  it('counts lines across every kind of line break', () => {
    expect(() => json5('[\n1,\r\n2,\r3,\u20284,\u20295,\n?]')).toThrow('at line 7, column 1');
  });
});

describe('readJson \u2014 json dialect', () => {
  it.each([
    ['{"a":[1,-2.5e3,true,false,null,"x"]}', { a: [1, -2500, true, false, null, 'x'] }],
    [' \t\n\r"s" ', 's'],
    ['"\\"\\\\\\/\\b\\f\\n\\r\\t\\u0041"', '"\\/\b\f\n\r\tA'],
    ['"\u2028"', '\u2028'],
  ])('reads %j', (text, expected) => {
    expect(json(text)).toEqual(expected);
  });

  it.each([
    "'single'",
    '{a:1}',
    "{'a':1}",
    '[1,]',
    '{"a":1,}',
    '+1',
    '.5',
    '1.',
    '0x1F',
    'Infinity',
    'NaN',
    '"\\v"',
    '"\\x41"',
    '"\\a"',
    '"\\\n"',
    '"tab\there"',
    '"\u0001"',
    '// c\n1',
    '\uFEFF1',
    '\u00A01',
  ])('rejects %j', (text) => {
    expect(() => json(text)).toThrow(SyntaxError);
  });
});

describe('readJson \u2014 I-JSON', () => {
  it('accepts plain I-JSON', () => {
    expect(iJson('{"a":[1,2.5,-0.001,9007199254740991,1e300,"\uD83D\uDE00"]}')).toEqual({ a: [1, 2.5, -0.001, 9007199254740991, 1e300, '\uD83D\uDE00'] });
  });

  it.each([
    ['{"a":1,"a":2}', 'duplicate key "a" (I-JSON) at line 1, column 8'],
    ['{"a":{"b":1},"c":{"b":2}}', null],
    ['"\\uD800"', 'string holds a lone surrogate or a noncharacter (I-JSON) at line 1, column 1'],
    ['"\\uDC00x"', 'string holds'],
    ['"\\uFDD0"', 'string holds'],
    ['"\\uFFFE"', 'string holds'],
    ['"\\uD83F\\uDFFF"', 'string holds'],
    ['{"\\uFFFF":1}', 'string holds'],
    ['1e400', 'number 1e400 is beyond the range of a double (I-JSON) at line 1, column 1'],
    ['-1e400', 'beyond the range'],
    ['3.141592653589793238', 'number 3.141592653589793238 is more precise than a double holds (I-JSON)'],
    ['1e-400', 'more precise'],
    ['9007199254740992', 'integer 9007199254740992 is outside the exact range of a double (I-JSON)'],
    ['-9007199254740992', 'outside the exact range'],
  ])('checks %j', (text, message) => {
    if (message === null) {
      expect(() => iJson(text)).not.toThrow();
    } else {
      expect(() => iJson(text)).toThrow(message);
    }
  });

  it('accepts numbers whose extra digits are only zeros', () => {
    expect(iJson('[1.500000000000000000000, 0.000, 100000000000000000000.0, 0e5]')).toEqual([1.5, 0, 1e20, 0]);
  });
});
