/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { globToRegExp } from './globToRegExp';

const literal = fc.string().filter((s) => !s.includes('*') && !s.includes('?'));

describe('globToRegExp — property-based', () => {
  it('never throws when compiling an arbitrary pattern', () => {
    fc.assert(
      fc.property(fc.string(), (pattern) => {
        expect(() => globToRegExp(pattern)).not.toThrow();
      }),
    );
  });

  it('a pattern with no wildcards only matches itself exactly', () => {
    fc.assert(
      fc.property(literal, literal, (s, other) => {
        const re = globToRegExp(s);
        expect(re.test(s)).toBe(true);
        if (s !== other) expect(re.test(other)).toBe(false);
      }),
    );
  });

  it('"*" alone matches any string', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(globToRegExp('*').test(s)).toBe(true);
      }),
    );
  });

  it('"?" alone matches exactly one character', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 1 }), (s) => {
        expect(globToRegExp('?').test(s)).toBe(true);
      }),
    );
  });

  it('wrapping any literal in *...* always matches', () => {
    fc.assert(
      fc.property(literal, fc.string(), fc.string(), (middle, prefix, suffix) => {
        expect(globToRegExp(`*${middle}*`).test(`${prefix}${middle}${suffix}`)).toBe(true);
      }),
    );
  });
});

describe('globToRegExp — contract', () => {
  it('a pattern of only "?" matches a string of the same length', () => {
    expect(globToRegExp('???').test('abc')).toBe(true);
    expect(globToRegExp('???').test('ab')).toBe(false);
  });

  it('consecutive wildcards compose correctly', () => {
    expect(globToRegExp('**').test('anything')).toBe(true);
    expect(globToRegExp('a??b').test('axyb')).toBe(true);
  });
});
