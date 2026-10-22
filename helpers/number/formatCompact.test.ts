/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatCompact } from './formatCompact';

describe('formatCompact', () => {
  it('formats millions', () => {
    expect(formatCompact(1_500_000, 'en')).toBe('1.5M');
  });

  it('formats thousands', () => {
    expect(formatCompact(1_000, 'en')).toBe('1K');
  });

  it('formats values under 1000 unchanged', () => {
    expect(formatCompact(999, 'en')).toBe('999');
  });

  it('formats zero', () => {
    expect(formatCompact(0, 'en')).toBe('0');
  });

  it('formats negative values', () => {
    expect(formatCompact(-2_000, 'en')).toBe('-2K');
  });

  it('formats billions', () => {
    expect(formatCompact(2_000_000_000, 'en')).toBe('2B');
  });

  it('returns a string', () => {
    expect(typeof formatCompact(42)).toBe('string');
  });

  it('accepts a locale parameter', () => {
    // Result varies by locale, but must be a non-empty string
    expect(formatCompact(1_000_000, 'fr').length).toBeGreaterThan(0);
  });

  it('uses runtime locale when no locale is provided', () => {
    expect(typeof formatCompact(10_000)).toBe('string');
  });
});
