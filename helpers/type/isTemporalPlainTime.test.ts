/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalPlainTime } from './isTemporalPlainTime';

describe('isTemporalPlainTime', () => {
  it('should return true for a Temporal.PlainTime', () => {
    const pt = Temporal.PlainTime.from('12:30:00');
    expect(isTemporalPlainTime(pt)).toBe(true);
  });

  it('should return true for Temporal.Now.plainTimeISO()', () => {
    expect(isTemporalPlainTime(Temporal.Now.plainTimeISO())).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalPlainTime(Temporal.Now.instant())).toBe(false);
    expect(isTemporalPlainTime(Temporal.Now.zonedDateTimeISO())).toBe(false);
    expect(isTemporalPlainTime(Temporal.Now.plainDateISO())).toBe(false);
    expect(isTemporalPlainTime(Temporal.Duration.from({ hours: 1 }))).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalPlainTime(new Date())).toBe(false);
    expect(isTemporalPlainTime('12:30:00')).toBe(false);
    expect(isTemporalPlainTime(null)).toBe(false);
    expect(isTemporalPlainTime(undefined)).toBe(false);
    expect(isTemporalPlainTime({})).toBe(false);
    expect(isTemporalPlainTime(42)).toBe(false);
  });
});
