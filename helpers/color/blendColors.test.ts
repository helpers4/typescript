/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { blendColors } from './blendColors';
import type { BlendMode } from './blendColors';

const gray = { r: 128, g: 128, b: 128 };

describe('blendColors', () => {
  it('composites with normal by default', () => {
    expect(blendColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255, a: 0.5 })).toEqual({ r: 128, g: 0, b: 128, a: 1 });
  });

  it('an opaque source replaces the backdrop with normal', () => {
    expect(blendColors({ r: 1, g: 2, b: 3 }, { r: 9, g: 8, b: 7 }, 'normal')).toEqual({ r: 9, g: 8, b: 7, a: 1 });
  });

  it('a transparent source leaves the backdrop alone', () => {
    expect(blendColors({ r: 1, g: 2, b: 3, a: 0.4 }, { r: 9, g: 8, b: 7, a: 0 }, 'multiply')).toEqual({ r: 1, g: 2, b: 3, a: 0.4 });
  });

  it('a transparent backdrop gives the source', () => {
    expect(blendColors({ r: 1, g: 2, b: 3, a: 0 }, { r: 9, g: 8, b: 7, a: 0.5 }, 'multiply')).toEqual({ r: 9, g: 8, b: 7, a: 0.5 });
  });

  it('returns transparent black when both are transparent', () => {
    expect(blendColors({ r: 1, g: 2, b: 3, a: 0 }, { r: 9, g: 8, b: 7, a: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  it('clamps out-of-range alphas', () => {
    expect(blendColors({ r: 1, g: 2, b: 3, a: 7 }, { r: 9, g: 8, b: 7, a: -1 })).toEqual({ r: 1, g: 2, b: 3, a: 1 });
  });

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const cases: [BlendMode, typeof gray, typeof gray, number][] = [
    ['multiply', { r: 200, g: 100, b: 50 }, { r: 100, g: 100, b: 100 }, 78],
    ['screen', gray, gray, 192],
    ['overlay', gray, { r: 51, g: 51, b: 51 }, 52],
    ['overlay', gray, { r: 204, g: 204, b: 204 }, 204],
    ['darken', { r: 10, g: 10, b: 10 }, { r: 200, g: 200, b: 200 }, 10],
    ['lighten', { r: 10, g: 10, b: 10 }, { r: 200, g: 200, b: 200 }, 200],
    ['color-dodge', black, gray, 0],
    ['color-dodge', gray, white, 255],
    ['color-dodge', gray, gray, 255],
    ['color-dodge', { r: 51, g: 51, b: 51 }, { r: 51, g: 51, b: 51 }, 64],
    ['color-burn', white, gray, 255],
    ['color-burn', gray, black, 0],
    ['color-burn', gray, gray, 2],
    ['color-burn', { r: 204, g: 204, b: 204 }, { r: 153, g: 153, b: 153 }, 170],
    ['hard-light', gray, { r: 51, g: 51, b: 51 }, 51],
    ['hard-light', gray, { r: 204, g: 204, b: 204 }, 204],
    ['soft-light', { r: 51, g: 51, b: 51 }, { r: 51, g: 51, b: 51 }, 27],
    ['soft-light', { r: 51, g: 51, b: 51 }, { r: 204, g: 204, b: 204 }, 89],
    ['soft-light', gray, { r: 204, g: 204, b: 204 }, 160],
    ['difference', { r: 200, g: 200, b: 200 }, { r: 50, g: 50, b: 50 }, 150],
    ['exclusion', { r: 200, g: 200, b: 200 }, { r: 100, g: 100, b: 100 }, 143],
  ];
  it.each(cases)('%s', (mode, backdrop, source, expected) => {
    expect(blendColors(backdrop, source, mode).r).toBe(expected);
  });

  it('blends with a partly transparent backdrop', () => {
    expect(blendColors({ r: 100, g: 100, b: 100, a: 0.5 }, { r: 200, g: 200, b: 200, a: 0.5 }, 'multiply')).toEqual({
      r: 126,
      g: 126,
      b: 126,
      a: 0.75,
    });
  });
});
