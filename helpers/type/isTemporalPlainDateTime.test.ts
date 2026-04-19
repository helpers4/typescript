/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

describe('isTemporalPlainDateTime — fallback without Temporal', () => {
  const savedTemporal = globalThis.Temporal;
  beforeAll(() => { (globalThis as Record<string, unknown>).Temporal = undefined; });
  afterAll(() => { (globalThis as Record<string, unknown>).Temporal = savedTemporal; });

  it('should return true for an object with matching toStringTag', () => {
    const fake = { [Symbol.toStringTag]: 'Temporal.PlainDateTime' };
    expect(isTemporalPlainDateTime(fake)).toBe(true);
  });

  it('should return false for an object with wrong toStringTag', () => {
    expect(isTemporalPlainDateTime({ [Symbol.toStringTag]: 'Temporal.Instant' })).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isTemporalPlainDateTime(null)).toBe(false);
    expect(isTemporalPlainDateTime(42)).toBe(false);
    expect(isTemporalPlainDateTime('2025-01-19T12:30:00')).toBe(false);
  });
});
