/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compose } from './compose';

describe('compose — property-based', () => {
  it('single identity function returns input unchanged', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(compose((x: number) => x)(n)).toBe(n);
      })
    );
  });

  it('two functions compose in reverse order', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 100 }), (n) => {
        const composed = compose(
          (x: number) => x * 3,
          (x: number) => x + 5
        );
        expect(composed(n)).toBe((n + 5) * 3);
      })
    );
  });
});
