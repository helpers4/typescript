/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Resolves the value type at a given path within T.
 * Returns `unknown` when the path doesn't match the shape of T.
 *
 * @internal
 * @example
 * DeepGet<{ a: { b: number } }, ['a', 'b']>  // => number
 * DeepGet<{ a: { b: number } }, ['a', 'x']>  // => unknown
 * DeepGet<{ a: number }, []>                  // => { a: number }
 */
export type DeepGet<T, Path extends readonly PropertyKey[]> =
  Path extends readonly []
    ? T
    : Path extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
      ? K extends keyof T
        ? DeepGet<T[K], Rest>
        : unknown
      : unknown;

/**
 * Produces the type of T after setting the value at Path to V.
 * Resolves to `never` when a key in Path is not present in the corresponding level of T,
 * surfacing invalid paths at the call site rather than silently returning T unchanged.
 *
 * @internal
 * @example
 * DeepSet<{ a: { b: number } }, ['a', 'b'], string>
 * // => { a: { b: string } }
 */
export type DeepSet<T, Path extends readonly PropertyKey[], V> =
  Path extends readonly []
    ? T
    : Path extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
      ? K extends keyof T
        ? { [P in keyof T]: P extends K ? DeepSet<T[K], Rest, V> : T[P] }
        : never
      : never;
