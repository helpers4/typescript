/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { combineSortFns } from './combineSortFns';
import type { SortFn } from './sort';
import { sortNumberAscFn } from './sort';

describe('combineSortFns — property-based', () => {
  it('with a single function, behaves identically to that function', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const combined = [...arr].sort(combineSortFns(sortNumberAscFn));
        const direct = [...arr].sort(sortNumberAscFn);
        expect(combined).toEqual(direct);
      }),
    );
  });

  it('an empty combinator is always a tie', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(combineSortFns<number>()(a, b)).toBe(0);
      }),
    );
  });

  it('sorts by the first key, breaking ties with the second key', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ primary: fc.integer({ min: 0, max: 5 }), secondary: fc.integer({ min: 0, max: 1000 }) })),
        (items) => {
          const byPrimary: SortFn<(typeof items)[number]> = (a, b) => a.primary - b.primary;
          const bySecondary: SortFn<(typeof items)[number]> = (a, b) => a.secondary - b.secondary;
          const sorted = [...items].sort(combineSortFns(byPrimary, bySecondary));
          for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1]!;
            const curr = sorted[i]!;
            expect(prev.primary < curr.primary || (prev.primary === curr.primary && prev.secondary <= curr.secondary)).toBe(true);
          }
        },
      ),
    );
  });
});
