/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration';

describe('formatDuration — property-based', () => {
  it('always returns a non-empty string', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }), (ms) => {
        const result = formatDuration(ms);
        expect(result.length).toBeGreaterThan(0);
      })
    );
  });

  it('ends with a unit suffix (s, m, or h)', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000_000, max: 1_000_000_000 }), (ms) => {
        const result = formatDuration(ms);
        expect(result).toMatch(/[smh]$/);
      })
    );
  });

  it('non-negative input never starts with -', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000_000 }), (ms) => {
        const result = formatDuration(ms);
        expect(result.startsWith('-')).toBe(false);
      })
    );
  });

  it('formatDuration(ms) and formatDuration(-ms) differ only by leading -', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1_000, max: 1_000_000_000 }), (ms) => {
        const pos = formatDuration(ms);
        const neg = formatDuration(-ms);
        expect(neg).toBe(`-${pos}`);
      })
    );
  });

  it('minUnit=hours never contains m or s units', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000_000 }), (ms) => {
        const result = formatDuration(ms, { minUnit: 'hours' });
        // Should only contain h suffix, not m or s
        expect(result).toMatch(/^\d+h$/);
      })
    );
  });

  it('minUnit=minutes never contains s unit', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000_000 }), (ms) => {
        const result = formatDuration(ms, { minUnit: 'minutes' });
        expect(result).not.toMatch(/\ds$/);
      })
    );
  });
});

describe('formatDuration — contract', () => {
  it('exact known values', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(1_000)).toBe('1s');
    expect(formatDuration(60_000)).toBe('1m 0s');
    expect(formatDuration(3_600_000)).toBe('1h 0m 0s');
  });

  it('NaN returns 0-like result', () => {
    const result = formatDuration(NaN);
    expect(result).toMatch(/[smh]$/);
  });
});
