/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns `never` for `null`/`undefined`, otherwise `keyof T`.
 *
 * Used instead of inlining `keyof NonNullable<T>` at each `DeepGet` recursion
 * step — TypeScript doesn't evaluate that expression eagerly inside a
 * recursive generic, so `keyof` ends up applied to an unresolved conditional
 * type instead of a concrete one. That collapses the whole recursive chain to
 * `never` (rather than `unknown`) the moment a path travels through a
 * property whose value is `null`, even though `null` itself is never in
 * `Path`. Checking the null-ness first, in its own conditional, forces eager
 * resolution and keeps that case at `unknown` as intended.
 * @ignore
 */
type KeysOf<T> = T extends null | undefined ? never : keyof T;

/**
 * Resolves the value type at a given `Path` within `T`.
 *
 * Returns `unknown` when any key in `Path` is not present in the corresponding
 * level of `T`. An empty path resolves to `T` itself. A path segment that goes
 * through an optional property keeps the result nullable (`V | undefined`)
 * instead of degrading to `unknown`.
 *
 * @example
 * type Obj = { a: { b: { c: number } } };
 *
 * DeepGet<Obj, ['a', 'b', 'c']> // => number
 * DeepGet<Obj, ['a', 'b']>      // => { c: number }
 * DeepGet<Obj, ['a', 'x']>      // => unknown
 * DeepGet<Obj, []>              // => Obj
 *
 * type WithOptional = { a?: { b: number } };
 * DeepGet<WithOptional, ['a', 'b']> // => number | undefined
 * @since 3.0.0
 */
export type DeepGet<T, Path extends readonly PropertyKey[]> =
  Path extends readonly []
    ? T
    : Path extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
      ? K extends KeysOf<T>
        ? DeepGet<NonNullable<T>[K & keyof NonNullable<T>], Rest> | (undefined extends T ? undefined : never)
        : unknown
      : unknown;
