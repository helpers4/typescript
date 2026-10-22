/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { endOf, startOf } from './startOf';

describe('startOf — property-based', () => {
  it('startOf("day") always has 00:00:00.000', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = startOf(d, 'day')!;
          expect(result.getHours()).toBe(0);
          expect(result.getMinutes()).toBe(0);
          expect(result.getSeconds()).toBe(0);
          expect(result.getMilliseconds()).toBe(0);
        }
      )
    );
  });

  it('startOf("month") always has day=1 and 00:00:00.000', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = startOf(d, 'month')!;
          expect(result.getDate()).toBe(1);
          expect(result.getHours()).toBe(0);
          expect(result.getMilliseconds()).toBe(0);
        }
      )
    );
  });

  it('startOf("year") always has month=0, day=1', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = startOf(d, 'year')!;
          expect(result.getMonth()).toBe(0);
          expect(result.getDate()).toBe(1);
          expect(result.getHours()).toBe(0);
        }
      )
    );
  });

  it('startOf is always <= the original date', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        fc.constantFrom('day' as const, 'month' as const, 'year' as const),
        (d, unit) => {
          const result = startOf(d, unit)!;
          expect(result.getTime()).toBeLessThanOrEqual(d.getTime());
        }
      )
    );
  });
});

describe('endOf — property-based', () => {
  it('endOf("day") always has 23:59:59.999', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = endOf(d, 'day')!;
          expect(result.getHours()).toBe(23);
          expect(result.getMinutes()).toBe(59);
          expect(result.getSeconds()).toBe(59);
          expect(result.getMilliseconds()).toBe(999);
        }
      )
    );
  });

  it('endOf("year") always has month=11, day=31', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        (d) => {
          const result = endOf(d, 'year')!;
          expect(result.getMonth()).toBe(11);
          expect(result.getDate()).toBe(31);
        }
      )
    );
  });

  it('endOf is always >= the original date', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        fc.constantFrom('day' as const, 'month' as const, 'year' as const),
        (d, unit) => {
          const result = endOf(d, unit)!;
          expect(result.getTime()).toBeGreaterThanOrEqual(d.getTime());
        }
      )
    );
  });

  it('startOf and endOf of the same unit bracket the original', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31'), noInvalidDate: true }),
        fc.constantFrom('day' as const, 'month' as const, 'year' as const),
        (d, unit) => {
          const s = startOf(d, unit)!;
          const e = endOf(d, unit)!;
          expect(s.getTime()).toBeLessThanOrEqual(d.getTime());
          expect(e.getTime()).toBeGreaterThanOrEqual(d.getTime());
          expect(s.getTime()).toBeLessThanOrEqual(e.getTime());
        }
      )
    );
  });
});

describe('startOf / endOf — contract', () => {
  it('startOf with string DateLike', () => {
    const result = startOf('2025-06-15T14:30:00Z', 'day');
    expect(result?.getHours()).toBe(0);
  });

  it('endOf with timestamp DateLike', () => {
    const result = endOf(1737244800000, 'day');
    expect(result?.getHours()).toBe(23);
  });

  it('invalid input → null', () => {
    expect(startOf('nope', 'day')).toBeNull();
    expect(endOf(0, 'month')).toBeNull();
  });
});
