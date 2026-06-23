/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Resolves the value type at a given `Path` within `T`.
 *
 * Returns `unknown` when any key in `Path` is not present in the corresponding
 * level of `T`. An empty path resolves to `T` itself.
 *
 * @example
 * type Obj = { a: { b: { c: number } } };
 *
 * DeepGet<Obj, ['a', 'b', 'c']> // => number
 * DeepGet<Obj, ['a', 'b']>      // => { c: number }
 * DeepGet<Obj, ['a', 'x']>      // => unknown
 * DeepGet<Obj, []>              // => Obj
 * @since 3.0.0
 */
export type DeepGet<T, Path extends readonly PropertyKey[]> =
  Path extends readonly []
    ? T
    : Path extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
      ? K extends keyof T
        ? DeepGet<T[K], Rest>
        : unknown
      : unknown;
