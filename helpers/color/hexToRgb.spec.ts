/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hexToRgb } from './hexToRgb';

describe('hexToRgb — property-based', () => {
  it('round-trips any 6-digit hex color to its exact channels', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, byte, byte, (r, g, b) => {
        const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
        expect(hexToRgb(hex)).toEqual({ r, g, b, a: 1 });
      }),
    );
  });

  it('never throws and always returns an object or null', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = hexToRgb(s);
        expect(result === null || typeof result === 'object').toBe(true);
      }),
    );
  });
});
