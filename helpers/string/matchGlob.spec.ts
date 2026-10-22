/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { matchGlob } from './matchGlob';

const plain = fc.string().filter((s) => !/[*?]/.test(s));

describe('matchGlob — property-based', () => {
  it('a pattern without wildcards matches only itself', () => {
    fc.assert(fc.property(plain, plain, (pattern, text) => {
      expect(matchGlob(pattern, text)).toBe(pattern === text);
    }));
  });

  it('prefix* matches anything that starts with the prefix', () => {
    fc.assert(fc.property(plain, fc.string().filter((s) => !s.includes('\n')), (prefix, rest) => {
      expect(matchGlob(`${prefix}*`, prefix + rest)).toBe(true);
    }));
  });
});
