/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import { roundTo } from '../number/roundTo';
import type { RgbColor } from './hexToRgb';

/**
 * The blend modes of the W3C Compositing and Blending specification, the same ones as CSS
 * `mix-blend-mode`. The last four (`hue`, `saturation`, `color`, `luminosity`) are non-separable:
 * they mix the three channels together instead of one channel at a time.
 * @since 3.1.8
 */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

type NonSeparable = 'hue' | 'saturation' | 'color' | 'luminosity';
type Triplet = readonly [number, number, number];

function hardLight(cb: number, cs: number): number {
  return cs <= 0.5 ? cb * 2 * cs : cb + (2 * cs - 1) - cb * (2 * cs - 1);
}

const BLEND: Record<Exclude<BlendMode, NonSeparable>, (cb: number, cs: number) => number> = {
  normal: (_cb, cs) => cs,
  multiply: (cb, cs) => cb * cs,
  screen: (cb, cs) => cb + cs - cb * cs,
  overlay: (cb, cs) => hardLight(cs, cb),
  darken: Math.min,
  lighten: Math.max,
  'color-dodge': (cb, cs) => (cb === 0 ? 0 : cs === 1 ? 1 : Math.min(1, cb / (1 - cs))),
  'color-burn': (cb, cs) => (cb === 1 ? 1 : cs === 0 ? 0 : 1 - Math.min(1, (1 - cb) / cs)),
  'hard-light': hardLight,
  'soft-light': (cb, cs) => {
    if (cs <= 0.5) return cb - (1 - 2 * cs) * cb * (1 - cb);
    const d = cb <= 0.25 ? ((16 * cb - 12) * cb + 4) * cb : Math.sqrt(cb);
    return cb + (2 * cs - 1) * (d - cb);
  },
  difference: (cb, cs) => Math.abs(cb - cs),
  exclusion: (cb, cs) => cb + cs - 2 * cb * cs,
};

const lum = ([r, g, b]: Triplet): number => 0.3 * r + 0.59 * g + 0.11 * b;
const sat = (c: Triplet): number => Math.max(...c) - Math.min(...c);

function clipColor(c: Triplet): Triplet {
  const l = lum(c);
  const n = Math.min(...c);
  const x = Math.max(...c);
  const clipped = c.map((v) => {
    const low = n < 0 ? l + ((v - l) * l) / (l - n) : v;
    return x > 1 ? l + ((low - l) * (1 - l)) / (x - l) : low;
  });
  return clipped as unknown as Triplet;
}

function setLum(c: Triplet, l: number): Triplet {
  const d = l - lum(c);
  return clipColor([c[0] + d, c[1] + d, c[2] + d]);
}

function setSat(c: Triplet, s: number): Triplet {
  const max = Math.max(...c);
  const min = Math.min(...c);
  if (max === min) return [0, 0, 0];
  return c.map((v) => ((v - min) * s) / (max - min)) as unknown as Triplet;
}

const NON_SEPARABLE: Record<NonSeparable, (cb: Triplet, cs: Triplet) => Triplet> = {
  hue: (cb, cs) => setLum(setSat(cs, sat(cb)), lum(cb)),
  saturation: (cb, cs) => setLum(setSat(cb, sat(cs)), lum(cb)),
  color: (cb, cs) => setLum(cs, lum(cb)),
  luminosity: (cb, cs) => setLum(cb, lum(cs)),
};

/**
 * Composites a source color over a backdrop with a blend mode, as the browser does for
 * `mix-blend-mode` (W3C Compositing and Blending Level 1, source-over). Both colors are straight
 * (non-premultiplied); the maths run in premultiplied space.
 *
 * @param backdrop - The color underneath
 * @param source - The color painted over it
 * @param mode - The blend mode. Defaults to `'normal'`, a plain alpha composite.
 * @returns The straight result: channels rounded to integers, alpha to 3 decimals
 * @example
 * blendColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255, a: 0.5 }) // => { r: 128, g: 0, b: 128, a: 1 }
 * @example
 * blendColors({ r: 200, g: 100, b: 50 }, { r: 100, g: 100, b: 100 }, 'multiply') // => { r: 78, g: 39, b: 20, a: 1 }
 * @since 3.1.8
 */
export function blendColors(backdrop: RgbColor, source: RgbColor, mode: BlendMode = 'normal'): RgbColor {
  const ab = clamp(backdrop.a ?? 1, 0, 1);
  const as = clamp(source.a ?? 1, 0, 1);
  const ar = as + ab * (1 - as);
  if (ar === 0) return { r: 0, g: 0, b: 0, a: 0 };

  const cb: Triplet = [backdrop.r / 255, backdrop.g / 255, backdrop.b / 255];
  const cs: Triplet = [source.r / 255, source.g / 255, source.b / 255];
  const blended: Triplet =
    mode === 'hue' || mode === 'saturation' || mode === 'color' || mode === 'luminosity'
      ? NON_SEPARABLE[mode](cb, cs)
      : [BLEND[mode](cb[0], cs[0]), BLEND[mode](cb[1], cs[1]), BLEND[mode](cb[2], cs[2])];

  const channel = (i: 0 | 1 | 2): number => {
    const mixed = (1 - ab) * cs[i] + ab * blended[i];
    return Math.round(255 * ((1 - as / ar) * cb[i] + (as / ar) * mixed));
  };

  return { r: channel(0), g: channel(1), b: channel(2), a: roundTo(ar, 3) };
}
