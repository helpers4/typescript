/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isBlank } from './isBlank';

describe('isBlank — property-based', () => {
  it('is always false for strings containing at least one non-whitespace character', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (s) => {
          expect(isBlank(s)).toBe(false);
        },
      ),
    );
  });

  it('is always true for strings of only ASCII whitespace', () => {
    const whitespaceChars = [' ', '\t', '\n', '\r', '\f', '\v'];
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...whitespaceChars), { minLength: 1 }).map((a) => a.join('')),
        (s) => {
          expect(isBlank(s)).toBe(true);
        },
      ),
    );
  });
});

describe('isBlank — contracts', () => {
  it('isBlank and isNotBlank are logical inverses', async () => {
    const { isNotBlank } = await import('./isNotBlank');
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isBlank(s)).toBe(!isNotBlank(s));
      }),
    );
  });

  it('is equivalent to value.trim() === ""', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isBlank(s)).toBe(s.trim() === '');
      }),
    );
  });

  it('isBlank implies isEmpty', async () => {
    const { isEmpty } = await import('./isEmpty');
    fc.assert(
      fc.property(fc.string(), (s) => {
        if (isEmpty(s)) expect(isBlank(s)).toBe(true); // empty ⊆ blank
      }),
    );
  });
});
