/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ensureDate } from './ensureDate';

describe('ensureDate — property-based', () => {
  it('valid Date inputs always return a Date', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const result = ensureDate(d);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });

  it('valid ISO date strings always return a Date', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const iso = d.toISOString();
        const result = ensureDate(iso);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });

  it('ensureDate result has same time as original valid Date', () => {
    fc.assert(
      fc.property(fc.date().filter((d) => !isNaN(d.getTime())), (d) => {
        const result = ensureDate(d);
        expect(result?.getTime()).toBe(d.getTime());
      })
    );
  });

  it('valid ms timestamps (>=10^10) always return a Date', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10_000_000_000, max: 2_000_000_000_000 }), (ts) => {
        const result = ensureDate(ts);
        expect(result).toBeInstanceOf(Date);
      })
    );
  });

  it('epochMilliseconds objects always return a Date with matching time', () => {
    fc.assert(
      fc.property(fc.integer({ min: -8_640_000_000_000_000, max: 8_640_000_000_000_000 }), (ms) => {
        const result = ensureDate({ epochMilliseconds: ms });
        expect(result).toBeInstanceOf(Date);
        expect(result?.getTime()).toBe(ms);
      })
    );
  });
});

describe('ensureDate — contract', () => {
  it('null → null', () => {
    expect(ensureDate(null)).toBeNull();
  });

  it('undefined → null', () => {
    expect(ensureDate(undefined)).toBeNull();
  });

  it('empty string → null', () => {
    expect(ensureDate('')).toBeNull();
  });

  it('0 → null', () => {
    expect(ensureDate(0)).toBeNull();
  });

  it('"invalid" string → null', () => {
    expect(ensureDate('invalid')).toBeNull();
  });

  it('invalid Date object → null', () => {
    expect(ensureDate(new Date('not-a-date'))).toBeNull();
  });

  it('valid ISO string → Date', () => {
    const result = ensureDate('2025-01-19T12:00:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe('2025-01-19T12:00:00.000Z');
  });

  it('unix timestamp in seconds → Date (normalized to ms)', () => {
    const result = ensureDate(1_000_000_000);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(1_000_000_000 * 1000);
  });

  it('unix timestamp in ms → Date', () => {
    const ts = 1_737_290_400_000;
    const result = ensureDate(ts);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ts);
  });

  it('Date object → same Date reference', () => {
    const d = new Date('2025-06-15T10:00:00.000Z');
    const result = ensureDate(d);
    expect(result).toBe(d);
  });

  it('epochMilliseconds object → Date', () => {
    const instant = { epochMilliseconds: 1_737_290_400_000 };
    const result = ensureDate(instant);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(1_737_290_400_000);
  });

  it('epochMilliseconds = 0 → Date at epoch', () => {
    const result = ensureDate({ epochMilliseconds: 0 });
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(0);
  });

  it('epochMilliseconds = NaN → null', () => {
    expect(ensureDate({ epochMilliseconds: NaN })).toBeNull();
  });
});
