/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * The properties of a font face that CSS font matching compares.
 * @since next
 */
export interface FontFaceDescriptor {
  /** CSS `font-weight`, 1-1000. Defaults to 400. */
  weight?: number;
  /** CSS `font-style`. Defaults to `'normal'`. Oblique angles are not compared. */
  style?: 'normal' | 'italic' | 'oblique';
  /** CSS `font-stretch` as a percentage (`condensed` is 75, `normal` 100, `expanded` 125). Defaults to 100. */
  stretch?: number;
}

const STYLE_ORDER = {
  normal: ['normal', 'oblique', 'italic'],
  italic: ['italic', 'oblique', 'normal'],
  oblique: ['oblique', 'italic', 'normal'],
} as const;

const ascending = (values: number[], keep: (v: number) => boolean) => values.filter(keep).toSorted((a, b) => a - b);
const descending = (values: number[], keep: (v: number) => boolean) => values.filter(keep).toSorted((a, b) => b - a);

/** Stretch values in the order CSS tries them. */
function stretchOrder(wanted: number, values: number[]): number[] {
  return wanted <= 100
    ? [...descending(values, (v) => v <= wanted), ...ascending(values, (v) => v > wanted)]
    : [...ascending(values, (v) => v >= wanted), ...descending(values, (v) => v < wanted)];
}

/** Weight values in the order CSS tries them. */
function weightOrder(wanted: number, values: number[]): number[] {
  if (wanted >= 400 && wanted <= 500) {
    return [
      ...ascending(values, (v) => v >= wanted && v <= 500),
      ...descending(values, (v) => v < wanted),
      ...ascending(values, (v) => v > 500),
    ];
  }
  return wanted < 400
    ? [...descending(values, (v) => v <= wanted), ...ascending(values, (v) => v > wanted)]
    : [...ascending(values, (v) => v >= wanted), ...descending(values, (v) => v < wanted)];
}

/** The faces holding the first of `order` that any face has. */
function keepFirst<T>(faces: readonly T[], read: (face: T) => number | string, order: readonly (number | string)[]): T[] {
  const best = order.find((value) => faces.some((face) => read(face) === value));
  return faces.filter((face) => read(face) === best);
}

/**
 * Picks the face that CSS would use for a request, among the faces of one family: the CSS Fonts
 * Level 4 matching algorithm (§5.2), as a pure function. The stretch is matched first, then the
 * style, then the weight; each step keeps only the faces closest to what was asked.
 *
 * - Stretch: at or below 100, narrower faces first (nearest), then wider ones; above 100, the other way round.
 * - Style: `normal` prefers normal, then oblique, then italic; `italic` prefers italic, then oblique, then
 *   normal; `oblique` prefers oblique, then italic, then normal.
 * - Weight: from 400 to 500, the nearest heavier weight up to 500, then lighter ones, then heavier ones
 *   above 500; below 400, lighter first then heavier; above 500, heavier first then lighter.
 *
 * @param faces - The faces of one family, for instance the entries of a font catalogue
 * @param wanted - What was asked; each missing property is its CSS initial value
 * @returns The closest face, the first one when several are equally close, or `undefined` for no face
 * @example
 * const faces = [{ weight: 300 }, { weight: 400 }, { weight: 700 }];
 * pickClosestFontFace(faces, { weight: 600 }) // => { weight: 700 }
 * @example
 * pickClosestFontFace([{ weight: 400 }, { weight: 400, style: 'italic' }], { style: 'italic' })
 * // => { weight: 400, style: 'italic' }
 * @since next
 */
export function pickClosestFontFace<T extends FontFaceDescriptor>(faces: readonly T[], wanted: FontFaceDescriptor = {}): T | undefined {
  const { weight = 400, style = 'normal', stretch = 100 } = wanted;

  const stretchOf = (face: T) => face.stretch ?? 100;
  const styleOf = (face: T) => face.style ?? 'normal';
  const weightOf = (face: T) => face.weight ?? 400;

  let pool = keepFirst(faces, stretchOf, stretchOrder(stretch, faces.map(stretchOf)));
  pool = keepFirst(pool, styleOf, STYLE_ORDER[style]);
  pool = keepFirst(pool, weightOf, weightOrder(weight, pool.map(weightOf)));

  return pool[0];
}
