/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { rgbToCss } from './rgbToCss';

describe('rgbToCss — property-based', () => {
  const byte = fc.integer({ min: 0, max: 255 });

  it('writes the channels as they are and alpha only when translucent', () => {
    fc.assert(fc.property(byte, byte, byte, fc.double({ min: 0, max: 1, noNaN: true }), (r, g, b, a) => {
      const css = rgbToCss({ r, g, b, a });
      expect(css.startsWith(`rgb(${r} ${g} ${b}`)).toBe(true);
      expect(css.includes(' / ')).toBe(a < 1);
    }));
  });
});
