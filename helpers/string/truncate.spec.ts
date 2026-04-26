/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { truncate } from './truncate';

describe('truncate — property-based', () => {
  it('result is never longer than maxLength', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.integer({ min: 0, max: 200 }),
        fc.string({ minLength: 1, maxLength: 5 }),
        (input, maxLength, ellipsis) => {
          const result = truncate(input, maxLength, ellipsis);
          expect(result.length).toBeLessThanOrEqual(maxLength);
        },
      ),
    );
  });

  it('string within limit is returned unchanged', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 100 }), (input) => {
        const result = truncate(input, input.length);
        expect(result).toBe(input);
      }),
    );
  });

  it('truncated result always ends with the ellipsis', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }),
        fc.integer({ min: 1, max: 9 }),
        fc.string({ minLength: 1, maxLength: 3 }),
        (input, maxLength, ellipsis) => {
          fc.pre(input.length > maxLength);
          fc.pre(ellipsis.length < maxLength);
          const result = truncate(input, maxLength, ellipsis);
          expect(result.endsWith(ellipsis)).toBe(true);
        },
      ),
    );
  });
});

describe('truncate — contract', () => {
  it('empty string is always returned as-is regardless of maxLength', () => {
    expect(truncate('', 0)).toBe('');
    expect(truncate('', 5)).toBe('');
    expect(truncate('', 100)).toBe('');
  });

  it('default ellipsis is the single-character …', () => {
    const result = truncate('Hello, world!', 6);
    expect(result).toBe('Hello…');
    expect(result.length).toBe(6);
  });

  it('custom ellipsis is respected', () => {
    expect(truncate('Hello, world!', 8, '...')).toBe('Hello...');
  });
});
