/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { lerp } from '../number/lerp';

/**
 * A value {@link interpolate} can blend: a number, or arrays and plain objects of them, nested
 * at will (a point, a color, a whole set of style properties).
 * @since next
 */
export type Interpolatable = number | readonly Interpolatable[] | { readonly [key: string]: Interpolatable };

/**
 * The type of an interpolated value: the shape of the input, with literal numbers widened to
 * `number` (`interpolate(0, 10, t)` is a `number`, not `0 | 10`).
 * @since next
 */
export type Interpolated<T> = T extends number
  ? number
  : T extends readonly unknown[]
    ? { -readonly [K in keyof T]: Interpolated<T[K]> }
    : { -readonly [K in keyof T]: Interpolated<T[K]> };

/**
 * Blends two values of the same shape: every number goes from its value in `from` (`t = 0`) to
 * its value in `to` (`t = 1`), with {@link lerp}, through arrays and plain objects.
 *
 * `t` is not clamped, so an easing that overshoots (a spring, a back curve) carries the value
 * past `to` and back. Keys and lengths come from `from`; the result is a new value.
 *
 * @param from - The value at `t = 0`
 * @param to - The value at `t = 1`, with the same shape
 * @param t - The progress, usually the output of an easing
 * @returns The blended value
 * @throws {TypeError} If `to` does not have the shape of `from` (a missing key, a different length, a number against an object)
 * @example
 * interpolate(0, 10, 0.5)                                  // => 5
 * interpolate({ x: 0, y: 100 }, { x: 50, y: 0 }, 0.5)      // => { x: 25, y: 50 }
 * interpolate([0, 0, 0], [255, 128, 0], 0.5)               // => [127.5, 64, 0]
 * @since next
 */
export function interpolate<T extends Interpolatable>(from: T, to: T, t: number): Interpolated<T> {
  return blend(from, to, t, '') as Interpolated<T>;
}

function blend(from: Interpolatable, to: Interpolatable, t: number, path: string): Interpolatable {
  if (typeof from === 'number') {
    if (typeof to !== 'number') throw mismatch(path);
    return lerp(from, to, t);
  }
  if (Array.isArray(from)) {
    if (!Array.isArray(to) || to.length !== from.length) throw mismatch(path);
    return from.map((value, i) => blend(value, (to as readonly Interpolatable[])[i]!, t, `${path}[${i}]`));
  }
  if (typeof to !== 'object' || Array.isArray(to)) throw mismatch(path);
  const target = to as { readonly [key: string]: Interpolatable };
  const result: { [key: string]: Interpolatable } = {};
  for (const [key, value] of Object.entries(from as { readonly [key: string]: Interpolatable })) {
    if (!Object.hasOwn(target, key)) throw mismatch(`${path}.${key}`);
    result[key] = blend(value, target[key]!, t, `${path}.${key}`);
  }
  return result;
}

function mismatch(path: string): TypeError {
  return new TypeError(`interpolate: \`to\` does not have the shape of \`from\` at ${path || 'the root'}`);
}
