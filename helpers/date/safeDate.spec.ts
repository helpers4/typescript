/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeDate, dateToISOString } from './safeDate';

describe('safeDate — property-based', () => {
  it('valid Date inputs always return a Date (or null for invalid dates)', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const result = safeDate(d);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });

  it('valid ISO date strings always return a Date', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const iso = d.toISOString();
        const result = safeDate(iso);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });

  it('safeDate result has same time as original valid Date', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const result = safeDate(d);
        expect(result?.getTime()).toBe(d.getTime());
      })
    );
  });

  it('valid ms timestamps (>=10^10) always return a Date', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10_000_000_000, max: 2_000_000_000_000 }), (ts) => {
        const result = safeDate(ts);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });
});

describe('safeDate — contract', () => {
  it('null → null', () => {
    expect(safeDate(null)).toBeNull();
  });

  it('undefined → null', () => {
    expect(safeDate(undefined)).toBeNull();
  });

  it('empty string → null', () => {
    expect(safeDate('')).toBeNull();
  });

  it('0 → null', () => {
    expect(safeDate(0)).toBeNull();
  });

  it('"invalid" string → null', () => {
    expect(safeDate('invalid')).toBeNull();
  });

  it('invalid Date object → null', () => {
    expect(safeDate(new Date('not-a-date'))).toBeNull();
  });

  it('valid ISO string → Date', () => {
    const result = safeDate('2025-01-19T12:00:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe('2025-01-19T12:00:00.000Z');
  });

  it('unix timestamp in seconds → Date (normalized to ms)', () => {
    // 1_000_000_000 seconds < 10^10, so treated as seconds
    const result = safeDate(1_000_000_000);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(1_000_000_000 * 1000);
  });

  it('unix timestamp in ms → Date', () => {
    const ts = 1_737_290_400_000; // > 10^10, treated as ms
    const result = safeDate(ts);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ts);
  });

  it('Date object → same Date (same getTime)', () => {
    const d = new Date('2025-06-15T10:00:00.000Z');
    const result = safeDate(d);
    expect(result?.getTime()).toBe(d.getTime());
  });
});

describe('dateToISOString — contract', () => {
  it('valid date → ISO string', () => {
    const result = dateToISOString('2025-01-19T12:00:00.000Z');
    expect(result).toBe('2025-01-19T12:00:00.000Z');
  });

  it('null → null', () => {
    expect(dateToISOString(null)).toBeNull();
  });

  it('undefined → null', () => {
    expect(dateToISOString(undefined)).toBeNull();
  });

  it('invalid string → null', () => {
    expect(dateToISOString('not-a-date')).toBeNull();
  });

  it('ms timestamp → ISO string', () => {
    const result = dateToISOString(1_737_290_400_000);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
