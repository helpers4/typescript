/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isSameDay, isSameMonth, isSameYear } from './is';

const validDate = () => fc.date().filter((d) => !isNaN(d.getTime()));

describe('isSameDay — property-based', () => {
  it('is reflexive: isSameDay(d, d) === true', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        expect(isSameDay(d, d)).toBe(true);
      })
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(isSameDay(a, b)).toBe(isSameDay(b, a));
      })
    );
  });

  it('same timestamp → true', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        const copy = new Date(d.getTime());
        expect(isSameDay(d, copy)).toBe(true);
      })
    );
  });
});

describe('isSameDay — contract', () => {
  it('same day different times → true', () => {
    const a = new Date('2025-06-15T00:00:00.000');
    const b = new Date('2025-06-15T23:59:59.999');
    expect(isSameDay(a, b)).toBe(true);
  });

  it('different days → false', () => {
    const a = new Date('2025-06-15T12:00:00.000');
    const b = new Date('2025-06-16T12:00:00.000');
    expect(isSameDay(a, b)).toBe(false);
  });

  it('1ms before midnight vs 1ms after midnight → false (local)', () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const before = new Date(midnight.getTime() - 1);
    const after = new Date(midnight.getTime() + 1);
    expect(isSameDay(before, after)).toBe(false);
  });

  it('different months → false', () => {
    expect(isSameDay(new Date('2025-01-31T12:00:00.000'), new Date('2025-02-01T12:00:00.000'))).toBe(false);
  });

  it('different years → false', () => {
    expect(isSameDay(new Date('2024-12-31T12:00:00.000'), new Date('2025-01-01T12:00:00.000'))).toBe(false);
  });

  it('invalid input → false', () => {
    expect(isSameDay('invalid', '2025-01-01')).toBe(false);
    expect(isSameDay('2025-01-01', 'invalid')).toBe(false);
  });

  it('string inputs work correctly', () => {
    expect(isSameDay('2025-06-15', '2025-06-15')).toBe(true);
    expect(isSameDay('2025-06-15', '2025-06-16')).toBe(false);
  });
});

describe('isSameMonth — property-based', () => {
  it('is reflexive', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        expect(isSameMonth(d, d)).toBe(true);
      })
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(isSameMonth(a, b)).toBe(isSameMonth(b, a));
      })
    );
  });
});

describe('isSameMonth — contract', () => {
  it('same month different days → true', () => {
    expect(isSameMonth('2025-01-01', '2025-01-31')).toBe(true);
  });

  it('different months → false', () => {
    expect(isSameMonth('2025-01-31', '2025-02-01')).toBe(false);
  });

  it('same month different years → false', () => {
    expect(isSameMonth('2024-06-15', '2025-06-15')).toBe(false);
  });

  it('invalid input → false', () => {
    expect(isSameMonth('invalid', '2025-01-01')).toBe(false);
  });
});

describe('isSameYear — property-based', () => {
  it('is reflexive', () => {
    fc.assert(
      fc.property(validDate(), (d) => {
        expect(isSameYear(d, d)).toBe(true);
      })
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(validDate(), validDate(), (a, b) => {
        expect(isSameYear(a, b)).toBe(isSameYear(b, a));
      })
    );
  });
});

describe('isSameYear — contract', () => {
  it('same year different months → true', () => {
    expect(isSameYear('2025-01-01', '2025-12-31')).toBe(true);
  });

  it('different years → false', () => {
    expect(isSameYear('2024-12-31', '2025-01-01')).toBe(false);
  });

  it('invalid input → false', () => {
    expect(isSameYear('invalid', '2025-01-01')).toBe(false);
  });
});
