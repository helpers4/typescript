/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { partial } from './partial';

describe('partial — property-based', () => {
  it('partial(fn, a)(b) === fn(a, b) for all inputs', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const fn = (x: number, y: number) => x * 7 - y;
        expect(partial(fn, a)(b)).toBe(fn(a, b));
      })
    );
  });

  it('partial(fn, a, b)(c) === fn(a, b, c) for all inputs', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const fn = (x: string, y: string, z: string) => [x, y, z].join('-');
        expect(partial(fn, a, b)(c)).toBe(fn(a, b, c));
      })
    );
  });
});
