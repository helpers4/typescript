/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

describe('isTemporalPlainDate — fallback without Temporal', () => {
  const savedTemporal = globalThis.Temporal;
  beforeAll(() => { (globalThis as Record<string, unknown>).Temporal = undefined; });
  afterAll(() => { (globalThis as Record<string, unknown>).Temporal = savedTemporal; });

  it('should return true for an object with matching toStringTag', () => {
    const fake = { [Symbol.toStringTag]: 'Temporal.PlainDate' };
    expect(isTemporalPlainDate(fake)).toBe(true);
  });

  it('should return false for an object with wrong toStringTag', () => {
    expect(isTemporalPlainDate({ [Symbol.toStringTag]: 'Temporal.Instant' })).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isTemporalPlainDate(null)).toBe(false);
    expect(isTemporalPlainDate(42)).toBe(false);
    expect(isTemporalPlainDate('2025-01-19')).toBe(false);
  });
});
