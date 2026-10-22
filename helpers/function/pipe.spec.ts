/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { pipe } from './pipe';

describe('pipe — property-based', () => {
  it('single identity function returns input unchanged', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(pipe((x: number) => x)(n)).toBe(n);
      })
    );
  });

  it('two functions compose in correct order', () => {
    fc.assert(
      fc.property(fc.integer({ min: -100, max: 100 }), (n) => {
        const piped = pipe(
          (x: number) => x + 5,
          (x: number) => x * 3
        );
        expect(piped(n)).toBe((n + 5) * 3);
      })
    );
  });
});
