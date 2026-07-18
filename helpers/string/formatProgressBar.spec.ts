/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatProgressBar } from './formatProgressBar';

describe('formatProgressBar — property-based', () => {
  it('always returns a string of exactly the (rounded, floored-at-0) width', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.integer({ min: -50, max: 50 }),
        (value, width) => {
          const bar = formatProgressBar(value, { width });
          expect(bar.length).toBe(Math.max(0, Math.round(width)));
        }
      )
    );
  });

  it('never throws for any finite value/width/max combination', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1e6, max: 1e6, noNaN: true }),
        fc.integer({ min: -20, max: 40 }),
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        (value, width, max) => {
          expect(() => formatProgressBar(value, { width, max })).not.toThrow();
        }
      )
    );
  });

  it('a value at or above max always yields a fully filled bar', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1000, noNaN: true }),
        fc.integer({ min: 0, max: 30 }),
        (max, width) => {
          expect(formatProgressBar(max, { width, max })).toBe('▓'.repeat(width));
          expect(formatProgressBar(max * 2, { width, max })).toBe('▓'.repeat(width));
        }
      )
    );
  });

  it('a value at or below 0 always yields a fully empty bar', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1, max: 1000, noNaN: true }),
        fc.integer({ min: 0, max: 30 }),
        fc.double({ min: -1000, max: 0, noNaN: true }),
        (max, width, value) => {
          expect(formatProgressBar(value, { width, max })).toBe('░'.repeat(width));
        }
      )
    );
  });
});
