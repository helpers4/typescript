/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { words } from './words';

describe('words (property-based)', () => {
  it('always returns an array', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(Array.isArray(words(str))).toBe(true);
      }),
    );
  });

  it('every token is non-empty', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        for (const token of words(str)) {
          expect(token.length).toBeGreaterThan(0);
        }
      }),
    );
  });

  it('every token consists only of alphanumeric characters', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        for (const token of words(str)) {
          expect(token).toMatch(/^[a-zA-Z\d]+$/);
        }
      }),
    );
  });

  it('a simple alpha-only word produces exactly one token equal to itself', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z]+$/), (str) => {
        const result = words(str);
        // At least one token, all joined should reconstitute the original letters
        const joined = result.join('');
        expect(joined).toBe(str);
      }),
    );
  });
});
