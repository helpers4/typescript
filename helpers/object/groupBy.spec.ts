/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { groupBy } from './groupBy';

describe('groupBy — property-based', () => {
  it('all original items appear exactly once in result groups', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 5 })),
        (items) => {
          const result = groupBy(items, n => n % 3);
          const flat = Object.values(result).flatMap(arr => arr ?? []);
          expect(flat).toHaveLength(items.length);
          expect(flat.sort((a, b) => a - b)).toEqual([...items].sort((a, b) => a - b));
        }
      )
    );
  });

  it('every key in result was produced by keyFn', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 5 })),
        (items) => {
          const result = groupBy(items, s => s.length % 3);
          for (const key of Object.keys(result)) {
            expect(Number(key)).toBeGreaterThanOrEqual(0);
            expect(Number(key)).toBeLessThan(3);
          }
        }
      )
    );
  });
});
