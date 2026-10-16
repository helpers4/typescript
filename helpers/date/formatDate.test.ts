/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats as "Mon D, YYYY" in English by default', () => {
    expect(formatDate('2026-07-27')).toBe('Jul 27, 2026');
  });

  it('replaces the default format with the given options', () => {
    expect(formatDate('2026-07-27', { month: 'short', day: 'numeric' })).toBe('Jul 27');
    expect(formatDate('2026-07-27', { year: 'numeric' })).toBe('2026');
  });

  it('uses the given locale', () => {
    expect(formatDate('2026-07-27', undefined, 'fr')).toBe('27 juil. 2026');
  });

  it('reads the date in UTC, whatever the machine timezone', () => {
    expect(formatDate('2026-01-01T00:00:00Z')).toBe('Jan 1, 2026');
    expect(formatDate('2026-12-31T23:59:59Z')).toBe('Dec 31, 2026');
  });

  it('accepts a Date and a timestamp', () => {
    expect(formatDate(new Date('2026-07-27T12:00:00Z'))).toBe('Jul 27, 2026');
    expect(formatDate(Date.UTC(2026, 6, 27, 12))).toBe('Jul 27, 2026');
  });

  it('returns null for an invalid date or locale', () => {
    expect(formatDate('nope')).toBeNull();
    expect(formatDate('2026-07-27', undefined, 'not a locale!')).toBeNull();
  });
});
