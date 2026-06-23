/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Produces the type of `T` after replacing the value at `Path` with `V`.
 *
 * Resolves to `never` when any key in `Path` is absent from the corresponding
 * level of `T`, surfacing invalid paths at the type level rather than silently
 * returning `T` unchanged.
 *
 * @example
 * type Obj = { a: { b: number; c: string } };
 *
 * DeepSet<Obj, ['a', 'b'], string>
 * // => { a: { b: string; c: string } }
 *
 * DeepSet<Obj, ['a', 'x'], string>
 * // => never  (key 'x' does not exist in { b: number; c: string })
 * @since 3.0.0
 */
export type DeepSet<T, Path extends readonly PropertyKey[], V> =
  Path extends readonly []
    ? V
    : Path extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
      ? K extends keyof T
        ? { [P in keyof T]: P extends K ? DeepSet<T[K], Rest, V> : T[P] }
        : never
      : never;
