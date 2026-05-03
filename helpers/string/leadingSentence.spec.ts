/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { leadingSentence } from './leadingSentence';

describe('leadingSentence — property-based', () => {
  it('result is always a prefix of the cleaned input', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const clean = str.replace(/\n/g, ' ').trim();
        const result = leadingSentence(str);
        expect(clean.startsWith(result)).toBe(true);
      })
    );
  });

  it('always returns a string', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(typeof leadingSentence(str)).toBe('string');
      })
    );
  });
});
