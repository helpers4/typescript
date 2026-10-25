/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { relativeLuminance } from './relativeLuminance';

const byte = fc.integer({ min: 0, max: 255 });
const color = fc.record({ r: byte, g: byte, b: byte });

describe('relativeLuminance — property-based', () => {
  it('stays between 0 and 1', () => {
    fc.assert(
      fc.property(color, (c) => {
        const l = relativeLuminance(c);
        expect(l).toBeGreaterThanOrEqual(0);
        expect(l).toBeLessThanOrEqual(1 + 1e-12);
      }),
    );
  });

  it('never decreases when a channel gets brighter', () => {
    fc.assert(
      fc.property(color, byte, (c, v) => {
        const brighter = { ...c, g: Math.max(c.g, v) };
        expect(relativeLuminance(brighter)).toBeGreaterThanOrEqual(relativeLuminance(c));
      }),
    );
  });

  it('ignores alpha', () => {
    fc.assert(
      fc.property(color, fc.double({ min: 0, max: 1, noNaN: true }), (c, a) => {
        expect(relativeLuminance({ ...c, a })).toBe(relativeLuminance(c));
      }),
    );
  });
});
