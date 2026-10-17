/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatPartial } from './formatPartial';

describe('formatPartial — property-based', () => {
  it('always contains the year', () => {
    fc.assert(fc.property(fc.integer({ min: 1000, max: 2999 }), fc.integer({ min: 1, max: 12 }), fc.integer({ min: 1, max: 28 }), (y, m, d) => {
      const mm = String(m).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      for (const input of [`${y}`, `${y}-${mm}`, `${y}-${mm}-${dd}`]) {
        expect(formatPartial(input)).toContain(String(y));
      }
    }));
  });

  it('never throws', () => {
    fc.assert(fc.property(fc.string(), (s) => {
      const r = formatPartial(s);
      expect(r === null || typeof r === 'string').toBe(true);
    }));
  });
});

describe('formatPartial — contract', () => {
  it('returns null for an empty string', () => {
    expect(formatPartial('')).toBeNull();
  });
});
