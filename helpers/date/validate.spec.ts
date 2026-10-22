/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isValidDateString } from './validate';

describe('isValidDateString — property-based', () => {
  it('ISO date strings from real dates are always valid', () => {
    fc.assert(
      fc.property(
        fc.date({ noInvalidDate: true }),
        (d) => {
          expect(isValidDateString(d.toISOString())).toBe(true);
        }
      )
    );
  });

  it('always returns a boolean', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = isValidDateString(s);
        expect(typeof result).toBe('boolean');
      })
    );
  });

  it('empty string is always invalid', () => {
    expect(isValidDateString('')).toBe(false);
  });
});

describe('isValidDateString — contract', () => {
  it('toDateString() output is valid for modern dates', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('1000-01-01'),
          max: new Date('9999-12-31'),
          noInvalidDate: true,
        }),
        (d) => {
          expect(isValidDateString(d.toDateString())).toBe(true);
        }
      )
    );
  });

  it('toUTCString() output is valid (when result is parseable)', () => {
    // Some engines may not round-trip toUTCString perfectly for extreme dates
    const d = new Date('2025-06-15T12:00:00Z');
    expect(isValidDateString(d.toUTCString())).toBe(true);
  });
});
