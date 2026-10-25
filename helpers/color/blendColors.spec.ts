/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { blendColors } from './blendColors';
import type { BlendMode } from './blendColors';

const MODES: BlendMode[] = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'];
const byte = fc.integer({ min: 0, max: 255 });
const color = fc.record({ r: byte, g: byte, b: byte, a: fc.double({ min: 0, max: 1, noNaN: true }) });

describe('blendColors — property-based', () => {
  it('always stays inside the 0-255 channel range and 0-1 alpha', () => {
    fc.assert(
      fc.property(color, color, fc.constantFrom(...MODES), (backdrop, source, mode) => {
        const out = blendColors(backdrop, source, mode);
        for (const channel of [out.r, out.g, out.b]) {
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(255);
        }
        expect(out.a).toBeGreaterThanOrEqual(0);
        expect(out.a).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('an opaque source replaces the backdrop with normal', () => {
    fc.assert(
      fc.property(color, byte, byte, byte, (backdrop, r, g, b) => {
        expect(blendColors(backdrop, { r, g, b })).toEqual({ r, g, b, a: 1 });
      }),
    );
  });
});
