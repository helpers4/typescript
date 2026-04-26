/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { safeJsonParse } from './safeJsonParse';

describe('safeJsonParse — property-based', () => {
  it('behaves like JSON.parse on any JSON-serialisable value', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const json = JSON.stringify(value);
        // Both sides go through JSON encoding — -0 becomes 0 in JSON (expected)
        expect(safeJsonParse(json)).toEqual(JSON.parse(json));
      }),
    );
  });

  it('always returns the fallback for non-JSON strings', () => {
    const fallback = 'FALLBACK';
    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          try {
            JSON.parse(s);
            return false;
          } catch {
            return true;
          }
        }),
        (invalidJson) => {
          expect(safeJsonParse(invalidJson, fallback)).toBe(fallback);
        },
      ),
    );
  });
});

describe('safeJsonParse — contract', () => {
  it('returns null (not undefined) when no fallback given and input is invalid', () => {
    const result = safeJsonParse('bad');
    expect(result).toBeNull();
  });

  it('does not throw on any string input', () => {
    expect(() => safeJsonParse('\x00\x01\x02')).not.toThrow();
    expect(() => safeJsonParse('undefined')).not.toThrow();
    expect(() => safeJsonParse("'single-quoted'")).not.toThrow();
  });

  it('fallback reference is returned as-is (no clone)', () => {
    const fallback = { original: true };
    const result = safeJsonParse('bad', fallback);
    expect(result).toBe(fallback);
  });
});
