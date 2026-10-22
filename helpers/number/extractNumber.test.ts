/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { extractNumber } from './extractNumber';

describe('extractNumber', () => {
  it('should extract a number embedded in text', () => {
    expect(extractNumber('16.5px')).toBe(16.5);
    expect(extractNumber('Wafer 10')).toBe(10);
    expect(extractNumber('Wafer 10.')).toBe(10);
    expect(extractNumber('no number here')).toBeUndefined();
  });

  describe('leading-dot decimals', () => {
    it('extracts a decimal with no leading digit', () => {
      expect(extractNumber('.5rem')).toBe(0.5);
      expect(extractNumber('.05em')).toBe(0.05);
      expect(extractNumber('opacity: .75')).toBe(0.75);
    });

    it('extracts a negative leading-dot decimal', () => {
      expect(extractNumber('-.5')).toBe(-0.5);
      expect(extractNumber('-.05')).toBe(-0.05);
    });

    it('treats a glued "-" before a leading-dot decimal as a separator (auto mode)', () => {
      expect(extractNumber('x-.5')).toBe(0.5);
    });

    it('treats a space-separated "-" before a leading-dot decimal as a sign (auto mode)', () => {
      expect(extractNumber('x -.5')).toBe(-0.5);
    });

    it('ignores a dot immediately after a word character (property separator, not decimal point)', () => {
      expect(extractNumber('text.5')).toBe(5);
      expect(extractNumber('obj.123')).toBe(123);
      expect(extractNumber('timeout.5s')).toBe(5);
    });
  });

  it('should pass through numbers, and reject NaN', () => {
    expect(extractNumber(42)).toBe(42);
    expect(extractNumber(-3.14)).toBe(-3.14);
    expect(extractNumber(Number.NaN)).toBeUndefined();
  });

  it('should return undefined for non-string, non-number values', () => {
    expect(extractNumber(null)).toBeUndefined();
    expect(extractNumber(undefined)).toBeUndefined();
    expect(extractNumber(true)).toBeUndefined();
    expect(extractNumber({})).toBeUndefined();
    expect(extractNumber([])).toBeUndefined();
  });

  it('should return the first number found in text with multiple numbers', () => {
    expect(extractNumber('Wafer 10 of 20')).toBe(10);
  });

  describe('sign disambiguation (default: auto)', () => {
    it('treats a glued "-" as a separator', () => {
      expect(extractNumber('xxx-111')).toBe(111);
    });

    it('treats a space-separated "-" as a minus sign', () => {
      expect(extractNumber('xxx -111')).toBe(-111);
    });

    it('treats a leading "-" at the start of the string as a minus sign', () => {
      expect(extractNumber('-111')).toBe(-111);
    });

    it('sign: "strict" always treats "-" as a minus sign', () => {
      expect(extractNumber('xxx-111', { sign: 'strict' })).toBe(-111);
    });

    it('sign: "ignore" never treats "-" as a minus sign', () => {
      expect(extractNumber('xxx -111', { sign: 'ignore' })).toBe(111);
      expect(extractNumber('-111', { sign: 'ignore' })).toBe(111);
    });
  });

  describe('exponent disambiguation (default: auto)', () => {
    it('treats a free-standing "e" suffix as scientific notation', () => {
      expect(extractNumber('1e5 mol')).toBe(100000);
      expect(extractNumber('1.5e-10')).toBe(1.5e-10);
    });

    it('treats a glued "e" suffix as plain text, not an exponent', () => {
      expect(extractNumber('1e5kg')).toBe(1);
    });

    it('exponent: "strict" always treats the suffix as scientific notation', () => {
      expect(extractNumber('1e5kg', { exponent: 'strict' })).toBe(100000);
    });

    it('exponent: "ignore" never treats the suffix as scientific notation', () => {
      expect(extractNumber('1e5 mol', { exponent: 'ignore' })).toBe(1);
    });
  });
});
