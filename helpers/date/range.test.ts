/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { clampDate, isWithinRange, overlaps } from './range';

// ---------------------------------------------------------------------------
// isWithinRange
// ---------------------------------------------------------------------------

describe('isWithinRange', () => {
  it('returns true when date is within range', () => {
    expect(isWithinRange('2025-06-15', '2025-01-01', '2025-12-31')).toBe(true);
  });

  it('returns true when date equals start', () => {
    expect(isWithinRange('2025-01-01', '2025-01-01', '2025-12-31')).toBe(true);
  });

  it('returns true when date equals end', () => {
    expect(isWithinRange('2025-12-31', '2025-01-01', '2025-12-31')).toBe(true);
  });

  it('returns false when date is before range', () => {
    expect(isWithinRange('2024-12-31', '2025-01-01', '2025-12-31')).toBe(false);
  });

  it('returns false when date is after range', () => {
    expect(isWithinRange('2026-01-01', '2025-01-01', '2025-12-31')).toBe(false);
  });

  it('accepts DateLike inputs (timestamps)', () => {
    const jan1 = new Date('2025-01-01').getTime();
    const jun15 = new Date('2025-06-15').getTime();
    const dec31 = new Date('2025-12-31').getTime();
    expect(isWithinRange(jun15, jan1, dec31)).toBe(true);
  });

  it('accepts DateLike inputs (Date objects)', () => {
    expect(
      isWithinRange(
        new Date('2025-06-15'),
        new Date('2025-01-01'),
        new Date('2025-12-31')
      )
    ).toBe(true);
  });

  it('returns false for invalid date input', () => {
    expect(isWithinRange('invalid', '2025-01-01', '2025-12-31')).toBe(false);
  });

  it('returns false for invalid start', () => {
    expect(isWithinRange('2025-06-15', 'invalid', '2025-12-31')).toBe(false);
  });

  it('returns false for invalid end', () => {
    expect(isWithinRange('2025-06-15', '2025-01-01', 'invalid')).toBe(false);
  });

  it('works with same start and end (single point)', () => {
    expect(isWithinRange('2025-06-15', '2025-06-15', '2025-06-15')).toBe(true);
    expect(isWithinRange('2025-06-14', '2025-06-15', '2025-06-15')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// clampDate
// ---------------------------------------------------------------------------

describe('clampDate', () => {
  it('returns the date when within range', () => {
    const result = clampDate('2025-06-15', '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-06-15');
  });

  it('clamps to min when date is before range', () => {
    const result = clampDate('2024-06-15', '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-01-01');
  });

  it('clamps to max when date is after range', () => {
    const result = clampDate('2026-06-15', '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-12-31');
  });

  it('returns a new Date (no mutation)', () => {
    const original = new Date('2025-06-15');
    const result = clampDate(original, '2025-01-01', '2025-12-31');
    expect(result).not.toBe(original);
    expect(result?.getTime()).toBe(original.getTime());
  });

  it('returns min when date equals min', () => {
    const result = clampDate('2025-01-01', '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-01-01');
  });

  it('returns max when date equals max', () => {
    const result = clampDate('2025-12-31', '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-12-31');
  });

  it('accepts DateLike inputs', () => {
    const ts = new Date('2025-06-15').getTime();
    const result = clampDate(ts, '2025-01-01', '2025-12-31');
    expect(result?.toISOString()).toContain('2025-06-15');
  });

  it('returns null for invalid date', () => {
    expect(clampDate('invalid', '2025-01-01', '2025-12-31')).toBeNull();
  });

  it('returns null for invalid min', () => {
    expect(clampDate('2025-06-15', 'invalid', '2025-12-31')).toBeNull();
  });

  it('returns null for invalid max', () => {
    expect(clampDate('2025-06-15', '2025-01-01', 'invalid')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// overlaps
// ---------------------------------------------------------------------------

describe('overlaps', () => {
  it('returns true when ranges partially overlap', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-06-30' },
        { start: '2025-03-01', end: '2025-12-31' }
      )
    ).toBe(true);
  });

  it('returns true when one range contains the other', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-12-31' },
        { start: '2025-03-01', end: '2025-06-30' }
      )
    ).toBe(true);
  });

  it('returns true when ranges share a single boundary', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-06-15' },
        { start: '2025-06-15', end: '2025-12-31' }
      )
    ).toBe(true);
  });

  it('returns false when ranges do not overlap', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-02-28' },
        { start: '2025-03-01', end: '2025-12-31' }
      )
    ).toBe(false);
  });

  it('returns true for identical ranges', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-12-31' },
        { start: '2025-01-01', end: '2025-12-31' }
      )
    ).toBe(true);
  });

  it('accepts DateLike inputs', () => {
    expect(
      overlaps(
        { start: new Date('2025-01-01'), end: new Date('2025-06-30') },
        { start: new Date('2025-03-01'), end: new Date('2025-12-31') }
      )
    ).toBe(true);
  });

  it('returns false for invalid dates in rangeA', () => {
    expect(
      overlaps(
        { start: 'invalid', end: '2025-06-30' },
        { start: '2025-03-01', end: '2025-12-31' }
      )
    ).toBe(false);
  });

  it('returns false for invalid dates in rangeB', () => {
    expect(
      overlaps(
        { start: '2025-01-01', end: '2025-06-30' },
        { start: '2025-03-01', end: 'invalid' }
      )
    ).toBe(false);
  });
});
