/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTemporalPlainDateTime } from './isTemporalPlainDateTime';

describe('isTemporalPlainDateTime', () => {
  it('should return true for a Temporal.PlainDateTime', () => {
    const pdt = Temporal.PlainDateTime.from('2025-01-19T12:30:00');
    expect(isTemporalPlainDateTime(pdt)).toBe(true);
  });

  it('should return true for Temporal.Now.plainDateTimeISO()', () => {
    expect(isTemporalPlainDateTime(Temporal.Now.plainDateTimeISO())).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalPlainDateTime(Temporal.Now.instant())).toBe(false);
    expect(isTemporalPlainDateTime(Temporal.Now.zonedDateTimeISO())).toBe(false);
    expect(isTemporalPlainDateTime(Temporal.Now.plainDateISO())).toBe(false);
    expect(isTemporalPlainDateTime(Temporal.Duration.from({ hours: 1 }))).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalPlainDateTime(new Date())).toBe(false);
    expect(isTemporalPlainDateTime('2025-01-19T12:30:00')).toBe(false);
    expect(isTemporalPlainDateTime(null)).toBe(false);
    expect(isTemporalPlainDateTime(undefined)).toBe(false);
    expect(isTemporalPlainDateTime({})).toBe(false);
    expect(isTemporalPlainDateTime(42)).toBe(false);
  });
});
