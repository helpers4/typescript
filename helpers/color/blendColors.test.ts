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

  describe('non-separable modes', () => {
    const lumOf = (c: { r: number; g: number; b: number }) => (0.3 * c.r + 0.59 * c.g + 0.11 * c.b) / 255;
    const red = { r: 255, g: 0, b: 0 };
    const blue = { r: 0, g: 0, b: 255 };
    const orange = { r: 240, g: 140, b: 40 };
    const teal = { r: 30, g: 150, b: 160 };

    it('luminosity keeps the backdrop colors with the source luminosity', () => {
      const out = blendColors(red, blue, 'luminosity');
      expect(lumOf(out)).toBeCloseTo(lumOf(blue), 1);
      expect(out.r).toBeGreaterThan(out.g);
      expect(lumOf(blendColors(orange, teal, 'luminosity'))).toBeCloseTo(lumOf(teal), 1);
    });

    it('color keeps the backdrop luminosity with the source hue and saturation', () => {
      expect(lumOf(blendColors(orange, teal, 'color'))).toBeCloseTo(lumOf(orange), 1);
      expect(lumOf(blendColors(red, blue, 'color'))).toBeCloseTo(lumOf(red), 1);
    });

    it('color clips what goes past white', () => {
      expect(blendColors({ r: 255, g: 255, b: 255 }, red, 'color')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    });

    it('hue takes the source hue with the backdrop saturation and luminosity', () => {
      expect(lumOf(blendColors(orange, teal, 'hue'))).toBeCloseTo(lumOf(orange), 1);
      const gray = blendColors({ r: 90, g: 90, b: 90 }, red, 'hue');
      expect(gray.r).toBe(gray.g);
      expect(gray.g).toBe(gray.b);
    });

    it('hue with a gray source and saturation with gray backdrop or source have no color', () => {
      const flat = blendColors(orange, { r: 100, g: 100, b: 100 }, 'hue');
      expect(flat.r).toBe(flat.g);
      expect(flat.g).toBe(flat.b);
      const grayBackdrop = blendColors({ r: 100, g: 100, b: 100 }, teal, 'saturation');
      expect(grayBackdrop.r).toBe(grayBackdrop.b);
    });

    it('saturation takes the source saturation with the backdrop hue and luminosity', () => {
      expect(lumOf(blendColors(orange, teal, 'saturation'))).toBeCloseTo(lumOf(orange), 1);
      const flat = blendColors(orange, { r: 70, g: 70, b: 70 }, 'saturation');
      expect(flat.r).toBe(flat.g);
    });

    it('a mode that mixes channels is a no-op for identical colors', () => {
      for (const mode of ['hue', 'saturation', 'color', 'luminosity'] as const) {
        const out = blendColors(orange, orange, mode);
        expect(Math.abs(out.r - orange.r)).toBeLessThanOrEqual(1);
        expect(Math.abs(out.g - orange.g)).toBeLessThanOrEqual(1);
        expect(Math.abs(out.b - orange.b)).toBeLessThanOrEqual(1);
      }
    });
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
