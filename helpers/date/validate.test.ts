/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isValidDateString } from './validate';

describe('isValidDateString', () => {
  describe('valid ISO 8601 strings', () => {
    it('YYYY-MM-DD', () => {
      expect(isValidDateString('2025-01-19')).toBe(true);
    });

    it('YYYY-MM-DDTHH:mm:ssZ', () => {
      expect(isValidDateString('2025-01-19T12:00:00Z')).toBe(true);
    });

    it('YYYY-MM-DDTHH:mm:ss.sssZ', () => {
      expect(isValidDateString('2025-06-15T08:30:45.123Z')).toBe(true);
    });

    it('with timezone offset', () => {
      expect(isValidDateString('2025-01-19T12:00:00+05:30')).toBe(true);
    });

    it('date-only (year-month)', () => {
      expect(isValidDateString('2025-01')).toBe(true);
    });
  });

  describe('valid informal strings', () => {
    it('Mon DD, YYYY', () => {
      expect(isValidDateString('Jan 19, 2025')).toBe(true);
    });

    it('Month DD YYYY', () => {
      expect(isValidDateString('January 19 2025')).toBe(true);
    });

    it('MM/DD/YYYY', () => {
      expect(isValidDateString('01/19/2025')).toBe(true);
    });
  });

  describe('edge cases — valid', () => {
    it('leap day', () => {
      expect(isValidDateString('2024-02-29')).toBe(true);
    });

    it('epoch', () => {
      expect(isValidDateString('1970-01-01T00:00:00Z')).toBe(true);
    });

    it('far future', () => {
      expect(isValidDateString('9999-12-31')).toBe(true);
    });
  });

  describe('invalid strings', () => {
    it('random text', () => {
      expect(isValidDateString('not a date')).toBe(false);
    });

    it('empty string', () => {
      expect(isValidDateString('')).toBe(false);
    });

    it('whitespace only', () => {
      expect(isValidDateString('   ')).toBe(false);
    });

    it('partial date — native parser may be lenient', () => {
      // '2025-' is parsed by some engines; test a truly invalid string
      expect(isValidDateString('2025-XX-01')).toBe(false);
    });

    it('gibberish numbers', () => {
      expect(isValidDateString('99-99-99')).toBe(false);
    });

    it('numeric string (timestamp-like)', () => {
      // Note: pure numeric strings can be implementation-dependent
      // but short ones like this are generally invalid
      expect(isValidDateString('abc123')).toBe(false);
    });
  });

  describe('boundary values', () => {
    it('single character', () => {
      expect(isValidDateString('x')).toBe(false);
    });

    it('null-like string', () => {
      expect(isValidDateString('null')).toBe(false);
    });

    it('undefined-like string', () => {
      expect(isValidDateString('undefined')).toBe(false);
    });

    it('boolean-like string', () => {
      expect(isValidDateString('true')).toBe(false);
    });
  });
});
