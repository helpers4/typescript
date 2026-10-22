/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatSize } from './formatSize';

describe('formatSize — property-based', () => {
  it('always returns a string ending with a known unit', () => {
    fc.assert(
      fc.property(fc.nat(10 ** 12), (bytes) => {
        const result = formatSize(bytes);
        expect(result).toMatch(/^[\d.]+[BKMGT]B?$/);
      }),
    );
  });

  it('result for values < 1024 always ends with "B" (no prefix)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1023 }), (bytes) => {
        expect(formatSize(bytes)).toMatch(/B$/);
        expect(formatSize(bytes)).not.toMatch(/KB|MB|GB|TB/);
      }),
    );
  });

  it('result for values >= 1024 and < 1_048_576 ends with "KB"', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1024, max: 1_048_575 }), (bytes) => {
        expect(formatSize(bytes)).toMatch(/KB$/);
      }),
    );
  });

  it('always contains a decimal point', () => {
    fc.assert(
      fc.property(fc.nat(10 ** 12), (bytes) => {
        expect(formatSize(bytes)).toContain('.');
      }),
    );
  });

  it('larger inputs within the same unit range produce a >= numeric value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1_048_575 }),
        fc.integer({ min: 1024, max: 1_048_575 }),
        (a, b) => {
          fc.pre(a !== b);
          const smaller = Math.min(a, b);
          const larger = Math.max(a, b);
          const smallerFormatted = formatSize(smaller);
          const largerFormatted = formatSize(larger);
          expect(smallerFormatted).toMatch(/KB$/);
          expect(largerFormatted).toMatch(/KB$/);
          expect(parseFloat(largerFormatted)).toBeGreaterThanOrEqual(parseFloat(smallerFormatted));
        },
      ),
    );
  });
});

describe('formatSize — contract', () => {
  it('0 bytes → "0.0B"', () => expect(formatSize(0)).toBe('0.0B'));
  it('exactly 1 KB', () => expect(formatSize(1024)).toBe('1.0KB'));
  it('exactly 1 MB', () => expect(formatSize(1024 * 1024)).toBe('1.0MB'));
  it('exactly 1 GB', () => expect(formatSize(1024 * 1024 * 1024)).toBe('1.0GB'));
});

describe('formatSize — options, property-based', () => {
  it('unitSeparator is always inserted verbatim right before the unit', () => {
    fc.assert(
      fc.property(fc.nat(10 ** 12), fc.constantFrom('', ' ', '-', '__'), (bytes, unitSeparator) => {
        const withSeparator = formatSize(bytes, { unitSeparator });
        const withoutSeparator = formatSize(bytes);
        expect(withSeparator).toBe(withoutSeparator.replace(/(B|KB|MB|GB|TB)$/, `${unitSeparator}$1`));
      }),
    );
  });

  it('integerBelowFirstUnit never introduces a decimal point below the first unit', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1023 }), (bytes) => {
        expect(formatSize(bytes, { integerBelowFirstUnit: true })).not.toContain('.');
      }),
    );
  });

  it('integerBelowFirstUnit leaves units at KB and above unchanged', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1024, max: 10 ** 12 }), (bytes) => {
        expect(formatSize(bytes, { integerBelowFirstUnit: true })).toBe(formatSize(bytes));
      }),
    );
  });
});
