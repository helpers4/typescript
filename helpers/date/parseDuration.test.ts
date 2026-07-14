/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDuration } from './parseDuration';

describe('parseDuration', () => {
  it('parses a full hours/minutes/seconds string', () => {
    expect(parseDuration('1h 23m 45s')).toBe(5_025_000);
  });

  it('parses without spaces between segments', () => {
    expect(parseDuration('1h23m45s')).toBe(5_025_000);
  });

  it('parses a single unit', () => {
    expect(parseDuration('45s')).toBe(45_000);
    expect(parseDuration('30m')).toBe(1_800_000);
    expect(parseDuration('2h')).toBe(7_200_000);
  });

  it('parses decimal values', () => {
    expect(parseDuration('1.5h')).toBe(5_400_000);
  });

  it('parses a negative duration', () => {
    expect(parseDuration('-1h 30m')).toBe(-5_400_000);
  });

  it('is case-insensitive on the unit letter', () => {
    expect(parseDuration('1H 30M')).toBe(5_400_000);
  });

  it('returns null for an empty string', () => {
    expect(parseDuration('')).toBeNull();
  });

  it('returns null for a whitespace-only string', () => {
    expect(parseDuration('   ')).toBeNull();
  });

  it('returns null when no valid segment is found', () => {
    expect(parseDuration('garbage')).toBeNull();
  });

  it('returns null for a bare negative sign', () => {
    expect(parseDuration('-')).toBeNull();
  });

  it('round-trips through formatDuration', () => {
    expect(parseDuration('1h 23m 45s')).toBe(5_025_000);
  });
});
