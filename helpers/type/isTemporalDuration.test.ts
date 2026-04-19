/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { isTemporalDuration } from './isTemporalDuration';

describe('isTemporalDuration', () => {
  it('should return true for a Temporal.Duration', () => {
    const dur = Temporal.Duration.from({ hours: 1, minutes: 30 });
    expect(isTemporalDuration(dur)).toBe(true);
  });

  it('should return true for a zero Duration', () => {
    const dur = Temporal.Duration.from({ seconds: 0 });
    expect(isTemporalDuration(dur)).toBe(true);
  });

  it('should return false for other Temporal types', () => {
    expect(isTemporalDuration(Temporal.Now.instant())).toBe(false);
    expect(isTemporalDuration(Temporal.Now.zonedDateTimeISO())).toBe(false);
    expect(isTemporalDuration(Temporal.Now.plainDateISO())).toBe(false);
    expect(isTemporalDuration(Temporal.Now.plainTimeISO())).toBe(false);
  });

  it('should return false for non-Temporal values', () => {
    expect(isTemporalDuration(new Date())).toBe(false);
    expect(isTemporalDuration(1000)).toBe(false);
    expect(isTemporalDuration('PT1H')).toBe(false);
    expect(isTemporalDuration(null)).toBe(false);
    expect(isTemporalDuration(undefined)).toBe(false);
    expect(isTemporalDuration({})).toBe(false);
    expect(isTemporalDuration({ hours: 1 })).toBe(false);
  });
});

describe('isTemporalDuration — fallback without Temporal', () => {
  const savedTemporal = globalThis.Temporal;
  beforeAll(() => { (globalThis as Record<string, unknown>).Temporal = undefined; });
  afterAll(() => { (globalThis as Record<string, unknown>).Temporal = savedTemporal; });

  it('should return true for an object with matching toStringTag', () => {
    const fake = { [Symbol.toStringTag]: 'Temporal.Duration' };
    expect(isTemporalDuration(fake)).toBe(true);
  });

  it('should return false for an object with wrong toStringTag', () => {
    expect(isTemporalDuration({ [Symbol.toStringTag]: 'Temporal.Instant' })).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isTemporalDuration(null)).toBe(false);
    expect(isTemporalDuration(42)).toBe(false);
    expect(isTemporalDuration('PT1H')).toBe(false);
  });
});
