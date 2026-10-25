/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { premultiply } from './premultiply';
import { unpremultiply } from './unpremultiply';

describe('premultiply / unpremultiply — property-based', () => {
  it('round-trips any visible color', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, byte, byte, fc.double({ min: 0.001, max: 1, noNaN: true }), (r, g, b, a) => {
        const back = unpremultiply(premultiply({ r, g, b, a }));
        expect(back.r).toBeCloseTo(r, 6);
        expect(back.g).toBeCloseTo(g, 6);
        expect(back.b).toBeCloseTo(b, 6);
        expect(back.a).toBe(a);
      }),
    );
  });

  it('never gives a channel above the straight one', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, fc.double({ min: 0, max: 1, noNaN: true }), (r, a) => {
        expect(premultiply({ r, g: 0, b: 0, a }).r).toBeLessThanOrEqual(r);
      }),
    );
  });
});
