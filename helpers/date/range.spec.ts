/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { clampDate, isWithinRange, overlaps } from './range';

const validDate = fc.date({
  min: new Date('2000-01-01'),
  max: new Date('2099-12-31'),
  noInvalidDate: true,
});

/** Returns an ordered pair [earlier, later]. */
function ordered(a: Date, b: Date): [Date, Date] {
  return a.getTime() <= b.getTime() ? [a, b] : [b, a];
}

// ---------------------------------------------------------------------------
// isWithinRange — property-based
// ---------------------------------------------------------------------------

describe('isWithinRange — property-based', () => {
  it('a date always falls within [date, date]', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(isWithinRange(d, d, d)).toBe(true);
      })
    );
  });

  it('start is always within [start, end]', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        expect(isWithinRange(s, s, e)).toBe(true);
      })
    );
  });

  it('end is always within [start, end]', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        expect(isWithinRange(e, s, e)).toBe(true);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// clampDate — property-based
// ---------------------------------------------------------------------------

describe('clampDate — property-based', () => {
  it('clamped date is always within [min, max]', () => {
    fc.assert(
      fc.property(validDate, validDate, validDate, (d, a, b) => {
        const [lo, hi] = ordered(a, b);
        const result = clampDate(d, lo, hi)!;
        expect(result.getTime()).toBeGreaterThanOrEqual(lo.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(hi.getTime());
      })
    );
  });

  it('clamping a date already in range preserves its time', () => {
    fc.assert(
      fc.property(validDate, validDate, validDate, (d, a, b) => {
        const [lo, hi] = ordered(a, b);
        if (d.getTime() >= lo.getTime() && d.getTime() <= hi.getTime()) {
          const result = clampDate(d, lo, hi)!;
          expect(result.getTime()).toBe(d.getTime());
        }
      })
    );
  });

  it('clamp is idempotent', () => {
    fc.assert(
      fc.property(validDate, validDate, validDate, (d, a, b) => {
        const [lo, hi] = ordered(a, b);
        const once = clampDate(d, lo, hi)!;
        const twice = clampDate(once, lo, hi)!;
        expect(twice.getTime()).toBe(once.getTime());
      })
    );
  });
});

// ---------------------------------------------------------------------------
// overlaps — property-based
// ---------------------------------------------------------------------------

describe('overlaps — property-based', () => {
  it('a range always overlaps with itself', () => {
    fc.assert(
      fc.property(validDate, validDate, (a, b) => {
        const [s, e] = ordered(a, b);
        expect(overlaps({ start: s, end: e }, { start: s, end: e })).toBe(true);
      })
    );
  });

  it('overlap is symmetric', () => {
    fc.assert(
      fc.property(validDate, validDate, validDate, validDate, (a, b, c, d) => {
        const [s1, e1] = ordered(a, b);
        const [s2, e2] = ordered(c, d);
        const r1 = { start: s1, end: e1 };
        const r2 = { start: s2, end: e2 };
        expect(overlaps(r1, r2)).toBe(overlaps(r2, r1));
      })
    );
  });

  it('a range contained within another always overlaps', () => {
    fc.assert(
      fc.property(validDate, validDate, validDate, validDate, (a, b, c, d) => {
        const sorted = [a, b, c, d].sort((x, y) => x.getTime() - y.getTime());
        const outer = { start: sorted[0], end: sorted[3] };
        const inner = { start: sorted[1], end: sorted[2] };
        expect(overlaps(outer, inner)).toBe(true);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// Contract tests
// ---------------------------------------------------------------------------

describe('range — contract', () => {
  it('isWithinRange with string DateLike', () => {
    expect(isWithinRange('2025-06-15', '2025-01-01', '2025-12-31')).toBe(true);
  });

  it('clampDate with timestamp DateLike', () => {
    const ts = new Date('2024-06-15').getTime();
    const result = clampDate(ts, '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-01-01');
  });

  it('overlaps with mixed DateLike', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: new Date('2025-06-30').getTime() },
        { start: new Date('2025-03-01'), end: '2025-12-31' }
      )
    ).toBe(true);
  });

  it('invalid inputs return safe defaults', () => {
    expect(isWithinRange('nope', '2025-01-01', '2025-12-31')).toBe(false);
    expect(clampDate('nope', '2025-01-01', '2025-12-31')).toBeNull();
    expect(overlaps({ start: 'nope', end: '2025-06-30' }, { start: '2025-01-01', end: '2025-12-31' })).toBe(false);
  });
});
