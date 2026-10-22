/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { difference } from './difference';

const validDate = () => fc.date().filter((d) => !isNaN(d.getTime()));

describe('difference — property-based', () => {
  it('difference(d, d) === 0 for all units', () => {
    const units = ['milliseconds', 'seconds', 'minutes', 'hours', 'days'] as const;
    fc.assert(
      fc.property(validDate(), (d) => {
        for (const unit of units) {
          expect(difference(d, d, { unit })).toBe(0);
        }
      })
    );
  });

  it('is symmetric when absolute is true (default)', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(difference(a, b)).toBe(difference(b, a));
      })
    );
  });

  it('absolute=false is antisymmetric: diff(a,b) === -diff(b,a)', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        const ab = difference(a, b, { absolute: false });
        const ba = difference(b, a, { absolute: false });
        expect(ab).toBeCloseTo(-ba, 5);
      })
    );
  });
});

describe('difference — contract', () => {
  it('1 hour in hours → 1', () => {
    expect(difference('2025-01-01T00:00:00Z', '2025-01-01T01:00:00Z', { unit: 'hours' })).toBe(1);
  });

  it('1 minute in seconds → 60', () => {
    expect(difference('2025-01-01T00:00:00Z', '2025-01-01T00:01:00Z', { unit: 'seconds' })).toBe(60);
  });

  it('invalid input → NaN', () => {
    expect(difference('invalid', '2025-01-01')).toBeNaN();
  });

  it('absolute=false with a > b → negative', () => {
    expect(difference('2025-01-10', '2025-01-01', { absolute: false })).toBeLessThan(0);
  });
});
