/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate — property-based', () => {
  it('always contains the UTC year of the date', () => {
    fc.assert(fc.property(
      fc.date({ min: new Date('1971-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
      (d) => {
        expect(formatDate(d)).toContain(String(d.getUTCFullYear()));
      },
    ));
  });

  it('never throws', () => {
    fc.assert(fc.property(fc.string(), (s) => {
      const r = formatDate(s);
      expect(r === null || typeof r === 'string').toBe(true);
    }));
  });
});

describe('formatDate — contract', () => {
  it('returns null for an empty string', () => {
    expect(formatDate('')).toBeNull();
  });
});
