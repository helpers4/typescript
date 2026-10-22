/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createMatcher } from './createMatcher';

const word = fc.string({ minLength: 1, maxLength: 8 }).filter((s) => !/[*?!\\/\n]/.test(s));

describe('createMatcher — property-based', () => {
  it('never throws for glob syntax, and a wildcard-free glob matches only itself', () => {
    fc.assert(fc.property(word, word, (pattern, text) => {
      expect(createMatcher(pattern, { syntax: 'glob' })(text)).toBe(pattern === text);
    }));
  });

  it('an array matches exactly when an inclusion matches and no exclusion does', () => {
    fc.assert(fc.property(fc.array(word, { maxLength: 4 }), fc.array(word, { maxLength: 4 }), word, (included, excluded, text) => {
      const matches = createMatcher([...included, ...excluded.map((w) => `!${w}`)]);
      const expected = (included.length === 0 || included.includes(text)) && !excluded.includes(text);
      expect(matches(text)).toBe(expected);
    }));
  });

  it('the order of an array does not matter', () => {
    fc.assert(fc.property(fc.array(fc.oneof(word, word.map((w) => `!${w}`)), { maxLength: 6 }), word, (patterns, text) => {
      expect(createMatcher(patterns.toReversed())(text)).toBe(createMatcher(patterns)(text));
    }));
  });
});
