/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { matrixToCss } from './matrixToCss';

const entry = fc.double({ min: -1e6, max: 1e6, noNaN: true });

describe('matrixToCss — property-based', () => {
  it('reads back to the same entries', () => {
    fc.assert(fc.property(entry, entry, entry, entry, entry, entry, (a, b, c, d, e, f) => {
      const css = matrixToCss({ a, b, c, d, e, f });
      expect(css.slice(7, -1).split(', ').map(Number)).toEqual([a, b, c, d, e, f].map((v) => v + 0));
    }));
  });
});
