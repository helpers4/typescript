/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { addDays, addMonths, addYears } from './add';

describe('addDays', () => {
  it('should add days', () => {
    const result = addDays('2025-01-19T00:00:00Z', 10);
    expect(result?.toISOString()).toBe('2025-01-29T00:00:00.000Z');
  });

  it('should subtract days with negative amount', () => {
    const result = addDays('2025-01-19T00:00:00Z', -5);
    expect(result?.toISOString()).toBe('2025-01-14T00:00:00.000Z');
  });

  it('should cross month boundaries', () => {
    const result = addDays('2025-01-28T00:00:00Z', 5);
    expect(result?.toISOString()).toBe('2025-02-02T00:00:00.000Z');
  });

  it('should handle zero', () => {
    const d = new Date('2025-01-19T12:00:00Z');
    const result = addDays(d, 0);
    expect(result?.toISOString()).toBe(d.toISOString());
    expect(result).not.toBe(d); // new instance
  });

  it('should accept DateLike inputs', () => {
    // timestamp
    const result = addDays(1737244800000, 1); // 2025-01-19T00:00:00Z
    expect(result?.getUTCDate()).toBe(20);
  });

  it('should return null for invalid input', () => {
    expect(addDays('invalid', 1)).toBeNull();
    expect(addDays(0, 1)).toBeNull();
  });

  it('should not mutate the original Date', () => {
    const d = new Date('2025-01-19T00:00:00Z');
    addDays(d, 10);
    expect(d.toISOString()).toBe('2025-01-19T00:00:00.000Z');
  });
});

describe('addMonths', () => {
  it('should add months', () => {
    const result = addMonths('2025-01-15T00:00:00Z', 1);
    expect(result?.toISOString()).toBe('2025-02-15T00:00:00.000Z');
  });

  it('should subtract months with negative amount', () => {
    const result = addMonths('2025-03-15T00:00:00Z', -1);
    expect(result?.toISOString()).toBe('2025-02-15T00:00:00.000Z');
  });

  it('should overflow when target month has fewer days', () => {
    // Jan 31 + 1 month → Feb has 28 days → overflows to Mar 3
    const result = addMonths('2025-01-31T00:00:00Z', 1);
    expect(result?.getUTCMonth()).toBe(2); // March (0-indexed)
  });

  it('should cross year boundaries', () => {
    const result = addMonths('2025-11-15T00:00:00Z', 3);
    expect(result?.getUTCFullYear()).toBe(2026);
    expect(result?.getUTCMonth()).toBe(1); // February
  });

  it('should handle zero', () => {
    const d = new Date('2025-06-15T00:00:00Z');
    const result = addMonths(d, 0);
    expect(result?.toISOString()).toBe(d.toISOString());
    expect(result).not.toBe(d);
  });

  it('should return null for invalid input', () => {
    expect(addMonths('invalid', 1)).toBeNull();
  });

  it('should not mutate the original Date', () => {
    const d = new Date('2025-01-15T00:00:00Z');
    addMonths(d, 3);
    expect(d.toISOString()).toBe('2025-01-15T00:00:00.000Z');
  });
});

describe('addYears', () => {
  it('should add years', () => {
    const result = addYears('2025-01-19T00:00:00Z', 1);
    expect(result?.getUTCFullYear()).toBe(2026);
  });

  it('should subtract years with negative amount', () => {
    const result = addYears('2025-06-15T00:00:00Z', -2);
    expect(result?.getUTCFullYear()).toBe(2023);
  });

  it('should handle leap year overflow', () => {
    // Feb 29 2024 + 1 year → 2025 has no Feb 29
    const result = addYears('2024-02-29T00:00:00Z', 1);
    expect(result?.getUTCMonth()).toBe(2); // March (overflow)
  });

  it('should handle zero', () => {
    const d = new Date('2025-01-19T00:00:00Z');
    const result = addYears(d, 0);
    expect(result?.getUTCFullYear()).toBe(2025);
    expect(result).not.toBe(d);
  });

  it('should return null for invalid input', () => {
    expect(addYears('invalid', 1)).toBeNull();
  });

  it('should not mutate the original Date', () => {
    const d = new Date('2025-01-19T00:00:00Z');
    addYears(d, 5);
    expect(d.toISOString()).toBe('2025-01-19T00:00:00.000Z');
  });
});
