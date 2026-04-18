/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { addDays, addMonths, addYears } from './add';

describe('addDays — property-based', () => {
  it('adding then subtracting N days returns the same date', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        fc.integer({ min: -1000, max: 1000 }),
        (d, n) => {
          const added = addDays(d, n);
          const restored = addDays(added!, -n);
          expect(restored?.getTime()).toBe(d.getTime());
        }
      )
    );
  });

  it('adding 0 days returns a date with the same time', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = addDays(d, 0);
          expect(result?.getTime()).toBe(d.getTime());
        }
      )
    );
  });
});

describe('addMonths — property-based', () => {
  it('adding 12 months equals adding 1 year (for day <= 28)', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2098-12-28'), noInvalidDate: true }).filter(d => d.getUTCDate() <= 28),
        (d) => {
          const plus12 = addMonths(d, 12);
          const plus1y = addYears(d, 1);
          expect(plus12?.getTime()).toBe(plus1y?.getTime());
        }
      )
    );
  });

  it('adding 0 months returns same time', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = addMonths(d, 0);
          expect(result?.getTime()).toBe(d.getTime());
        }
      )
    );
  });
});

describe('addYears — property-based', () => {
  it('adding then subtracting N years returns the same date (for day <= 28)', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2080-12-28'), noInvalidDate: true }).filter(d => d.getUTCDate() <= 28),
        fc.integer({ min: -10, max: 10 }),
        (d, n) => {
          const added = addYears(d, n);
          const restored = addYears(added!, -n);
          expect(restored?.getTime()).toBe(d.getTime());
        }
      )
    );
  });
});

describe('add — contract', () => {
  it('addDays with string input', () => {
    const result = addDays('2025-06-15T00:00:00Z', 1);
    expect(result?.toISOString()).toBe('2025-06-16T00:00:00.000Z');
  });

  it('addMonths with timestamp input', () => {
    const result = addMonths(1737244800000, 1); // 2025-01-19
    expect(result).toBeInstanceOf(Date);
  });

  it('addYears with Date input', () => {
    const d = new Date('2025-06-15T00:00:00Z');
    const result = addYears(d, 5);
    expect(result?.getUTCFullYear()).toBe(2030);
  });

  it('all return null for null/invalid', () => {
    expect(addDays(0, 1)).toBeNull();
    expect(addMonths('invalid', 1)).toBeNull();
    expect(addYears('', 1)).toBeNull();
  });
});
