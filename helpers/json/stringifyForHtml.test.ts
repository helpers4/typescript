/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stringifyForHtml } from './stringifyForHtml';

describe('stringifyForHtml', () => {
  it('escapes <, > and & as \\uXXXX', () => {
    expect(stringifyForHtml({ a: '</script><b>&' })).toBe('{"a":"\\u003c/script\\u003e\\u003cb\\u003e\\u0026"}');
  });

  it('escapes U+2028 and U+2029', () => {
    expect(stringifyForHtml('\u2028\u2029')).toBe('"\\u2028\\u2029"');
  });

  it('escapes in keys too', () => {
    expect(stringifyForHtml({ '</script>': 1 })).toBe('{"\\u003c/script\\u003e":1}');
  });

  it('leaves other values as compact JSON', () => {
    expect(stringifyForHtml({ a: [1, true, null], b: 'é' })).toBe('{"a":[1,true,null],"b":"é"}');
  });

  it('round-trips through JSON.parse', () => {
    const value = { s: '<!-- x --> & </script> \u2028', n: [1, 2] };
    expect(JSON.parse(stringifyForHtml(value))).toEqual(value);
  });

  it('throws like stringify on values JSON cannot hold', () => {
    expect(() => stringifyForHtml(undefined)).toThrow(TypeError);
    expect(() => stringifyForHtml(1n)).toThrow(TypeError);
  });
});
