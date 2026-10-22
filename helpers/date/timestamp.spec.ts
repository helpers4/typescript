/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  fromMillis,
  fromSeconds,
  isTimestampInSeconds,
  normalizeTimestamp,
  toMillis,
  toSeconds,
} from './timestamp';

const SECONDS_BOUNDARY = 10_000_000_000;

describe('normalizeTimestamp — property-based', () => {
  it('seconds-range inputs are multiplied by 1000', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: SECONDS_BOUNDARY - 1 }), (ts) => {
        // Input is in seconds range → must be multiplied by 1000
        expect(normalizeTimestamp(ts)).toBe(ts * 1000);
      })
    );
  });

  it('ms-range inputs are returned unchanged', () => {
    fc.assert(
      fc.property(fc.integer({ min: SECONDS_BOUNDARY, max: 2_000_000_000_000 }), (ts) => {
        expect(normalizeTimestamp(ts)).toBe(ts);
      })
    );
  });
});

describe('isTimestampInSeconds — property-based', () => {
  it('values < 10^10 are always considered seconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: SECONDS_BOUNDARY - 1 }), (ts) => {
        expect(isTimestampInSeconds(ts)).toBe(true);
      })
    );
  });

  it('values >= 10^10 are never considered seconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: SECONDS_BOUNDARY, max: 2_000_000_000_000 }), (ts) => {
        expect(isTimestampInSeconds(ts)).toBe(false);
      })
    );
  });
});

describe('normalizeTimestamp — contract', () => {
  it('0 → treated as seconds → 0', () => {
    expect(normalizeTimestamp(0)).toBe(0);
  });

  it('9_999_999_999 (< 10^10) → seconds → ×1000', () => {
    expect(normalizeTimestamp(9_999_999_999)).toBe(9_999_999_999_000);
  });

  it('10_000_000_000 (= 10^10) → ms → unchanged', () => {
    expect(normalizeTimestamp(SECONDS_BOUNDARY)).toBe(SECONDS_BOUNDARY);
  });

  it('large ms timestamp → unchanged', () => {
    const ts = 1_737_290_400_000;
    expect(normalizeTimestamp(ts)).toBe(ts);
  });
});

describe('isTimestampInSeconds — contract', () => {
  it('0 → true (treated as seconds)', () => {
    expect(isTimestampInSeconds(0)).toBe(true);
  });

  it('9_999_999_999 → true', () => {
    expect(isTimestampInSeconds(9_999_999_999)).toBe(true);
  });

  it('10_000_000_000 → false', () => {
    expect(isTimestampInSeconds(SECONDS_BOUNDARY)).toBe(false);
  });

  it('1_737_290_400_000 → false', () => {
    expect(isTimestampInSeconds(1_737_290_400_000)).toBe(false);
  });

  it('-1_642_694_400 → true (negative seconds)', () => {
    expect(isTimestampInSeconds(-1_642_694_400)).toBe(true);
  });

  it('-1_642_694_400_000 → false (negative ms)', () => {
    expect(isTimestampInSeconds(-1_642_694_400_000)).toBe(false);
  });
});

describe('negative timestamps — property-based', () => {
  it('negative seconds-range values are detected as seconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: -(SECONDS_BOUNDARY - 1), max: -1 }), (ts) => {
        expect(isTimestampInSeconds(ts)).toBe(true);
      })
    );
  });

  it('negative ms-range values are detected as milliseconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: -2_000_000_000_000, max: -SECONDS_BOUNDARY }), (ts) => {
        expect(isTimestampInSeconds(ts)).toBe(false);
      })
    );
  });

  it('negative seconds are multiplied by 1000', () => {
    fc.assert(
      fc.property(fc.integer({ min: -(SECONDS_BOUNDARY - 1), max: -1 }), (ts) => {
        expect(normalizeTimestamp(ts)).toBe(ts * 1000);
      })
    );
  });

  it('negative ms values are returned unchanged', () => {
    fc.assert(
      fc.property(fc.integer({ min: -2_000_000_000_000, max: -SECONDS_BOUNDARY }), (ts) => {
        expect(normalizeTimestamp(ts)).toBe(ts);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// toSeconds / toMillis — property-based
// ---------------------------------------------------------------------------

describe('toSeconds / toMillis — property-based', () => {
  const validDate = fc.date({
    min: new Date('1970-01-01'),
    max: new Date('2099-12-31'),
    noInvalidDate: true,
  });

  it('toMillis returns the same value as Date.getTime()', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(toMillis(d)).toBe(d.getTime());
      })
    );
  });

  it('toSeconds × 1000 ≤ toMillis (floor truncation)', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        const s = toSeconds(d)!;
        const ms = toMillis(d)!;
        expect(s * 1000).toBeLessThanOrEqual(ms);
        expect(s * 1000).toBeGreaterThan(ms - 1000);
      })
    );
  });

  it('toSeconds is always an integer', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        expect(Number.isInteger(toSeconds(d))).toBe(true);
      })
    );
  });
});

// ---------------------------------------------------------------------------
// fromSeconds / fromMillis — property-based
// ---------------------------------------------------------------------------

describe('fromSeconds / fromMillis — property-based', () => {
  it('fromSeconds round-trips with toSeconds', () => {
    // Use integer seconds to avoid sub-second loss
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 4_102_444_800 }), (s) => {
        const date = fromSeconds(s);
        expect(date).not.toBeNull();
        expect(toSeconds(date!)).toBe(s);
      })
    );
  });

  it('fromMillis round-trips with toMillis', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 4_102_444_800_000 }), (ms) => {
        const date = fromMillis(ms);
        expect(date).not.toBeNull();
        expect(toMillis(date!)).toBe(ms);
      })
    );
  });

  it('fromSeconds(s).getTime() === s * 1000', () => {
    fc.assert(
      fc.property(fc.integer({ min: -2_000_000_000, max: 2_000_000_000 }), (s) => {
        const date = fromSeconds(s)!;
        expect(date.getTime()).toBe(s * 1000);
      })
    );
  });

  it('fromMillis(ms).getTime() === ms', () => {
    fc.assert(
      fc.property(fc.integer({ min: -2_000_000_000_000, max: 2_000_000_000_000 }), (ms) => {
        const date = fromMillis(ms)!;
        expect(date.getTime()).toBe(ms);
      })
    );
  });
});
