/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { eachDay, eachMonth } from './sequence';

// ---------------------------------------------------------------------------
// eachDay
// ---------------------------------------------------------------------------

describe('eachDay', () => {
  it('returns each day between two dates (inclusive)', () => {
    const result = eachDay('2025-01-01', '2025-01-03');
    expect(result).toHaveLength(3);
    expect(result[0].getDate()).toBe(1);
    expect(result[1].getDate()).toBe(2);
    expect(result[2].getDate()).toBe(3);
  });

  it('returns a single element when start equals end', () => {
    const result = eachDay('2025-06-15', '2025-06-15');
    expect(result).toHaveLength(1);
  });

  it('returns empty array when start > end', () => {
    const result = eachDay('2025-12-31', '2025-01-01');
    expect(result).toHaveLength(0);
  });

  it('handles month boundaries', () => {
    const result = eachDay('2025-01-30', '2025-02-02');
    expect(result).toHaveLength(4);
    expect(result[0].getMonth()).toBe(0); // Jan
    expect(result[0].getDate()).toBe(30);
    expect(result[3].getMonth()).toBe(1); // Feb
    expect(result[3].getDate()).toBe(2);
  });

  it('handles leap year Feb 28-29', () => {
    const result = eachDay('2024-02-28', '2024-03-01');
    expect(result).toHaveLength(3); // 28, 29, Mar 1
    expect(result[1].getDate()).toBe(29);
  });

  it('handles non-leap year Feb 28 to Mar 1', () => {
    const result = eachDay('2025-02-28', '2025-03-01');
    expect(result).toHaveLength(2); // 28, Mar 1
  });

  it('normalizes time to 00:00:00.000', () => {
    const result = eachDay('2025-06-15T14:30:00Z', '2025-06-16T18:00:00Z');
    for (const d of result) {
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    }
  });

  it('accepts DateLike inputs (timestamps)', () => {
    const start = new Date('2025-01-01').getTime();
    const end = new Date('2025-01-03').getTime();
    const result = eachDay(start, end);
    expect(result).toHaveLength(3);
  });

  it('accepts DateLike inputs (Date objects)', () => {
    const result = eachDay(new Date('2025-01-01'), new Date('2025-01-05'));
    expect(result).toHaveLength(5);
  });

  it('returns empty array for invalid start', () => {
    expect(eachDay('invalid', '2025-01-03')).toHaveLength(0);
  });

  it('returns empty array for invalid end', () => {
    expect(eachDay('2025-01-01', 'invalid')).toHaveLength(0);
  });

  it('does not mutate inputs', () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-05');
    const startTime = start.getTime();
    const endTime = end.getTime();
    eachDay(start, end);
    expect(start.getTime()).toBe(startTime);
    expect(end.getTime()).toBe(endTime);
  });

  it('returns independent Date objects', () => {
    const result = eachDay('2025-01-01', '2025-01-03');
    result[0].setFullYear(2000);
    expect(result[1].getFullYear()).toBe(2025);
  });
});

// ---------------------------------------------------------------------------
// eachMonth
// ---------------------------------------------------------------------------

describe('eachMonth', () => {
  it('returns each month between two dates (inclusive)', () => {
    const result = eachMonth('2025-01-15', '2025-04-10');
    expect(result).toHaveLength(4);
    expect(result[0].getMonth()).toBe(0); // Jan
    expect(result[1].getMonth()).toBe(1); // Feb
    expect(result[2].getMonth()).toBe(2); // Mar
    expect(result[3].getMonth()).toBe(3); // Apr
  });

  it('each returned date is the 1st of the month at 00:00:00.000', () => {
    const result = eachMonth('2025-01-15', '2025-06-20');
    for (const d of result) {
      expect(d.getDate()).toBe(1);
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    }
  });

  it('returns a single element when same month', () => {
    const result = eachMonth('2025-06-01', '2025-06-30');
    expect(result).toHaveLength(1);
  });

  it('returns empty array when start > end', () => {
    const result = eachMonth('2025-12-01', '2025-01-01');
    expect(result).toHaveLength(0);
  });

  it('handles year boundaries', () => {
    const result = eachMonth('2024-11-01', '2025-02-01');
    expect(result).toHaveLength(4);
    expect(result[0].getFullYear()).toBe(2024);
    expect(result[0].getMonth()).toBe(10); // Nov
    expect(result[3].getFullYear()).toBe(2025);
    expect(result[3].getMonth()).toBe(1); // Feb
  });

  it('handles multiple years', () => {
    const result = eachMonth('2024-01-01', '2025-12-31');
    expect(result).toHaveLength(24);
  });

  it('accepts DateLike inputs', () => {
    const result = eachMonth(
      new Date('2025-01-15').getTime(),
      new Date('2025-03-20')
    );
    expect(result).toHaveLength(3);
  });

  it('returns empty array for invalid start', () => {
    expect(eachMonth('invalid', '2025-04-01')).toHaveLength(0);
  });

  it('returns empty array for invalid end', () => {
    expect(eachMonth('2025-01-01', 'invalid')).toHaveLength(0);
  });

  it('returns independent Date objects', () => {
    const result = eachMonth('2025-01-01', '2025-03-01');
    result[0].setFullYear(2000);
    expect(result[1].getFullYear()).toBe(2025);
  });
});
