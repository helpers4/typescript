/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hexToRgb } from './hexToRgb';
import { rgbToHex } from './rgbToHex';

describe('rgbToHex — property-based', () => {
  it('always returns a well-formed 6 or 8-digit lowercase hex string', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, byte, byte, fc.option(fc.float({ min: 0, max: 1, noNaN: true }), { nil: undefined }), (r, g, b, a) => {
        const result = rgbToHex({ r, g, b, a });
        expect(/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(result)).toBe(true);
      }),
    );
  });

  it('round-trips through hexToRgb for opaque colors', () => {
    const byte = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(byte, byte, byte, (r, g, b) => {
        const hex = rgbToHex({ r, g, b });
        expect(hexToRgb(hex)).toEqual({ r, g, b, a: 1 });
      }),
    );
  });
});
