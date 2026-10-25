/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createGlobMatcher } from './createGlobMatcher';

describe('createGlobMatcher — property-based', () => {
  it('never throws, and a string without wildcards or a leading ! matches itself', () => {
    fc.assert(fc.property(fc.string().filter((s) => !/[*?]/.test(s) && !s.startsWith('!') && !s.startsWith('\\!') && !s.includes('\n')), (text) => {
      expect(createGlobMatcher(text)(text)).toBe(true);
      expect(createGlobMatcher([text])(text)).toBe(true);
    }));
  });

  it('never reads a re: or glob: prefix, whatever follows it', () => {
    fc.assert(fc.property(fc.constantFrom('re:', 'glob:'), fc.string().filter((s) => !/[*?]/.test(s) && !s.includes('\n')), (prefix, rest) => {
      const text = prefix + rest;
      expect(createGlobMatcher(text)(text)).toBe(true);
    }));
  });
});
