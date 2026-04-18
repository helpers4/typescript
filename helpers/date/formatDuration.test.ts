/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration';

describe('formatDuration — basic', () => {
  it('formats hours, minutes, seconds', () => {
    expect(formatDuration(5_025_000)).toBe('1h 23m 45s');
  });

  it('formats seconds only', () => {
    expect(formatDuration(45_000)).toBe('45s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(150_000)).toBe('2m 30s');
  });

  it('formats hours with trailing zeros', () => {
    expect(formatDuration(3_600_000)).toBe('1h 0m 0s');
  });

  it('formats zero as 0s', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('formats sub-second as 0s', () => {
    expect(formatDuration(500)).toBe('0s');
  });

  it('formats exactly 1 second', () => {
    expect(formatDuration(1_000)).toBe('1s');
  });

  it('formats exactly 1 minute', () => {
    expect(formatDuration(60_000)).toBe('1m 0s');
  });

  it('formats exactly 1 hour', () => {
    expect(formatDuration(3_600_000)).toBe('1h 0m 0s');
  });

  it('formats large values', () => {
    // 100 hours
    expect(formatDuration(360_000_000)).toBe('100h 0m 0s');
  });
});

describe('formatDuration — negative', () => {
  it('prefixes negative durations with -', () => {
    expect(formatDuration(-5_025_000)).toBe('-1h 23m 45s');
  });

  it('negative seconds only', () => {
    expect(formatDuration(-45_000)).toBe('-45s');
  });

  it('negative zero stays 0s (no minus)', () => {
    expect(formatDuration(-0)).toBe('0s');
  });

  it('negative sub-second stays 0s', () => {
    expect(formatDuration(-500)).toBe('0s');
  });
});

describe('formatDuration — minUnit option', () => {
  it('minUnit=minutes drops seconds', () => {
    expect(formatDuration(5_025_000, { minUnit: 'minutes' })).toBe('1h 23m');
  });

  it('minUnit=hours drops minutes and seconds', () => {
    expect(formatDuration(5_025_000, { minUnit: 'hours' })).toBe('1h');
  });

  it('zero with minUnit=minutes', () => {
    expect(formatDuration(0, { minUnit: 'minutes' })).toBe('0m');
  });

  it('zero with minUnit=hours', () => {
    expect(formatDuration(0, { minUnit: 'hours' })).toBe('0h');
  });

  it('30 seconds with minUnit=minutes shows 0m', () => {
    expect(formatDuration(30_000, { minUnit: 'minutes' })).toBe('0m');
  });

  it('30 minutes with minUnit=hours shows 0h', () => {
    expect(formatDuration(1_800_000, { minUnit: 'hours' })).toBe('0h');
  });
});

describe('formatDuration — padded option', () => {
  it('pads single-digit values', () => {
    expect(formatDuration(5_025_000, { padded: true })).toBe('01h 23m 45s');
  });

  it('pads seconds only', () => {
    expect(formatDuration(5_000, { padded: true })).toBe('05s');
  });

  it('pads zero', () => {
    expect(formatDuration(0, { padded: true })).toBe('00s');
  });

  it('does not pad two-digit values extra', () => {
    expect(formatDuration(45_000, { padded: true })).toBe('45s');
  });

  it('pads hours with trailing zeros', () => {
    expect(formatDuration(3_600_000, { padded: true })).toBe('01h 00m 00s');
  });

  it('padded + minUnit=minutes', () => {
    expect(formatDuration(5_025_000, { padded: true, minUnit: 'minutes' })).toBe('01h 23m');
  });
});

describe('formatDuration — decimal milliseconds truncated', () => {
  it('truncates fractional ms', () => {
    expect(formatDuration(5_025_500)).toBe('1h 23m 45s');
  });

  it('truncates negative fractional ms', () => {
    expect(formatDuration(-5_025_500)).toBe('-1h 23m 45s');
  });
});
