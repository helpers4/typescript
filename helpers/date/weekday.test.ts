/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { WeekDays, isBusinessDay, isWeekend } from './weekday';

// 2025-01-13 = Monday, 14 = Tue, … 17 = Friday, 18 = Saturday, 19 = Sunday

// ---------------------------------------------------------------------------
// isWeekend — default (Sat/Sun)
// ---------------------------------------------------------------------------

describe('isWeekend — default weekend', () => {
  it('returns true for Saturday', () => {
    expect(isWeekend('2025-01-18')).toBe(true);
  });

  it('returns true for Sunday', () => {
    expect(isWeekend('2025-01-19')).toBe(true);
  });

  it('returns false for Monday', () => {
    expect(isWeekend('2025-01-13')).toBe(false);
  });

  it('returns false for Friday', () => {
    expect(isWeekend('2025-01-17')).toBe(false);
  });

  it('returns false for Wednesday', () => {
    expect(isWeekend('2025-01-15')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isWeekend — custom weekend days
// ---------------------------------------------------------------------------

describe('isWeekend — custom weekendDays', () => {
  const middleEast = [WeekDays.Friday, WeekDays.Saturday] as const;

  it('Friday is weekend with Friday/Saturday', () => {
    expect(isWeekend('2025-01-17', middleEast)).toBe(true);
  });

  it('Saturday is weekend with Friday/Saturday', () => {
    expect(isWeekend('2025-01-18', middleEast)).toBe(true);
  });

  it('Sunday is NOT weekend with Friday/Saturday', () => {
    expect(isWeekend('2025-01-19', middleEast)).toBe(false);
  });

  it('Friday is weekend with [Friday] only', () => {
    expect(isWeekend('2025-01-17', [WeekDays.Friday])).toBe(true);
  });

  it('empty weekendDays means no day is a weekend', () => {
    expect(isWeekend('2025-01-18', [])).toBe(false);
    expect(isWeekend('2025-01-19', [])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isWeekend — edge cases
// ---------------------------------------------------------------------------

describe('isWeekend — edge cases', () => {
  it('accepts DateLike inputs (Date object)', () => {
    expect(isWeekend(new Date('2025-01-18'))).toBe(true);
  });

  it('accepts DateLike inputs (timestamp)', () => {
    const sat = new Date('2025-01-18').getTime();
    expect(isWeekend(sat)).toBe(true);
  });

  it('returns false for invalid input', () => {
    expect(isWeekend('invalid')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isBusinessDay — default (Mon-Fri)
// ---------------------------------------------------------------------------

describe('isBusinessDay — default weekend', () => {
  it('returns true for Monday', () => {
    expect(isBusinessDay('2025-01-13')).toBe(true);
  });

  it('returns true for Friday', () => {
    expect(isBusinessDay('2025-01-17')).toBe(true);
  });

  it('returns false for Saturday', () => {
    expect(isBusinessDay('2025-01-18')).toBe(false);
  });

  it('returns false for Sunday', () => {
    expect(isBusinessDay('2025-01-19')).toBe(false);
  });

  it('returns true for Wednesday', () => {
    expect(isBusinessDay('2025-01-15')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isBusinessDay — custom weekend days
// ---------------------------------------------------------------------------

describe('isBusinessDay — custom weekendDays', () => {
  const middleEast = [WeekDays.Friday, WeekDays.Saturday] as const;

  it('Sunday is a business day with Friday/Saturday weekend', () => {
    expect(isBusinessDay('2025-01-19', middleEast)).toBe(true);
  });

  it('Friday is NOT a business day with Friday/Saturday weekend', () => {
    expect(isBusinessDay('2025-01-17', middleEast)).toBe(false);
  });

  it('all days are business days with empty weekendDays', () => {
    expect(isBusinessDay('2025-01-18', [])).toBe(true);
    expect(isBusinessDay('2025-01-19', [])).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isBusinessDay — edge cases
// ---------------------------------------------------------------------------

describe('isBusinessDay — edge cases', () => {
  it('accepts DateLike inputs (Date object)', () => {
    expect(isBusinessDay(new Date('2025-01-13'))).toBe(true);
  });

  it('accepts DateLike inputs (timestamp)', () => {
    const mon = new Date('2025-01-13').getTime();
    expect(isBusinessDay(mon)).toBe(true);
  });

  it('returns false for invalid input', () => {
    expect(isBusinessDay('invalid')).toBe(false);
  });
});
