/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { dateToISOString, safeDate } from './safeDate';

describe('safeDate (deprecated)', () => {
  it('delegates to ensureDate for valid input', () => {
    const result = safeDate('2025-01-19T12:00:00Z');
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toBe('2025-01-19T12:00:00.000Z');
  });

  it('delegates to ensureDate for Date input', () => {
    const d = new Date('2025-06-15');
    expect(safeDate(d)).toBe(d);
  });

  it('returns null for null', () => {
    expect(safeDate(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(safeDate(undefined)).toBeNull();
  });

  it('returns null for invalid string', () => {
    expect(safeDate('nope')).toBeNull();
  });
});

describe('dateToISOString (deprecated)', () => {
  it('returns ISO string for valid input', () => {
    expect(dateToISOString('2025-01-19T12:00:00Z')).toBe('2025-01-19T12:00:00.000Z');
  });

  it('returns ISO string for Date input', () => {
    const d = new Date('2025-06-15T00:00:00Z');
    expect(dateToISOString(d)).toBe('2025-06-15T00:00:00.000Z');
  });

  it('returns null for null', () => {
    expect(dateToISOString(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(dateToISOString(undefined)).toBeNull();
  });

  it('returns null for invalid string', () => {
    expect(dateToISOString('invalid')).toBeNull();
  });
});
