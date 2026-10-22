/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escapeRegExp } from './escapeRegExp';
import { createRegexMatcher } from './createRegexMatcher';

describe('createRegexMatcher — property-based', () => {
  it('an escaped, anchored string matches exactly itself', () => {
    fc.assert(fc.property(fc.string(), fc.string(), (source, other) => {
      const matches = createRegexMatcher(`^${escapeRegExp(source)}$`);
      expect(matches(source)).toBe(true);
      expect(matches(other)).toBe(other === source);
    }));
  });
});
