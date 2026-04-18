/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalPlainDate } from './isTemporalPlainDate';

describe('isTemporalPlainDate', () => {
  it('should return true for a Temporal.PlainDate', () => {
    const pd = Temporal.PlainDate.from('2025-01-19');
    expect(isTemporalPlainDate(pd)).toBe(true);
  });

  it('should return true for Temporal.Now.plainDateISO()', () => {
    expect(isTemporalPlainDate(Temporal.Now.plainDateISO())).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalPlainDate(Temporal.Now.instant())).toBe(false);
    expect(isTemporalPlainDate(Temporal.Now.zonedDateTimeISO())).toBe(false);
    expect(isTemporalPlainDate(Temporal.Now.plainDateTimeISO())).toBe(false);
    expect(isTemporalPlainDate(Temporal.Duration.from({ days: 1 }))).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalPlainDate(new Date())).toBe(false);
    expect(isTemporalPlainDate('2025-01-19')).toBe(false);
    expect(isTemporalPlainDate(null)).toBe(false);
    expect(isTemporalPlainDate(undefined)).toBe(false);
    expect(isTemporalPlainDate({})).toBe(false);
    expect(isTemporalPlainDate(42)).toBe(false);
  });
});
