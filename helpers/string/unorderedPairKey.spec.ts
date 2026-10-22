/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { unorderedPairKey } from './unorderedPairKey';

describe('unorderedPairKey — property-based', () => {
  it('is order-independent', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(unorderedPairKey(a, b)).toBe(unorderedPairKey(b, a));
      }),
    );
  });

  it('always contains both inputs and the separator', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('|')),
        fc.string().filter((s) => !s.includes('|')),
        (a, b) => {
          const key = unorderedPairKey(a, b);
          expect(key).toContain(a);
          expect(key).toContain(b);
          expect(key).toContain('|');
        },
      ),
    );
  });

  it('two distinct unordered pairs (with a "|"-free alphabet) never collide', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.includes('|')),
        fc.string().filter((s) => !s.includes('|')),
        fc.string().filter((s) => !s.includes('|')),
        fc.string().filter((s) => !s.includes('|')),
        (a, b, c, d) => {
          const sameUnorderedPair = (a === c && b === d) || (a === d && b === c);
          if (!sameUnorderedPair) {
            expect(unorderedPairKey(a, b) === unorderedPairKey(c, d)).toBe(false);
          }
        },
      ),
    );
  });
});

describe('unorderedPairKey — contract', () => {
  it('a custom separator is respected even when it could appear in the inputs', () => {
    expect(unorderedPairKey('a:b', 'c', ':')).toBe('a:b:c');
  });
});
