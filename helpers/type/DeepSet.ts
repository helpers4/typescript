/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Builds a brand-new nested object type from the remaining path segments and a leaf value type.
 * Used by `DeepSet` once a path segment no longer matches an existing key on T.
 * @ignore
 */
type BuildPath<Path extends readonly PropertyKey[], V> =
  Path extends readonly [infer K extends PropertyKey, ...infer Rest extends readonly PropertyKey[]]
    ? Record<K, BuildPath<Rest, V>>
    : V;

/**
 * Produces the type of `T` after replacing the value at `Path` with `V`.
 *
 * When a key in `Path` is absent from the corresponding level of `T`, that level
 * (and everything below it) is added as a new field instead of resolving to
 * `never` — mirroring how `set()` creates intermediate objects at runtime.
 *
 * @example
 * type Obj = { a: { b: number; c: string } };
 *
 * DeepSet<Obj, ['a', 'b'], string>
 * // => { a: { b: string; c: string } }
 *
 * DeepSet<Obj, ['a', 'x'], boolean>
 * // => { a: { b: number; c: string } & { x: boolean } }
 * @since 3.0.0
 */
export type DeepSet<T, Path extends readonly PropertyKey[], V> =
  Path extends readonly []
    ? V
    : Path extends readonly [infer K extends PropertyKey, ...infer Rest extends readonly PropertyKey[]]
      ? K extends keyof T
        ? { [P in keyof T]: P extends K ? DeepSet<T[K], Rest, V> : T[P] }
        : T & Record<K, BuildPath<Rest, V>>
      : never;
