/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Parses a `[n]` bracket index: numeric index strings become `number`, anything else stays `string`.
 * @internal
 */
type BracketKey<S extends string> = S extends `${number}` ? number : S;

/**
 * Parses consecutive bracket segments: `'[0][1]'` → `[0, 1]`.
 * @internal
 */
type ParseBrackets<S extends string> =
  S extends `[${infer Idx}]${infer Rest}`
    ? [BracketKey<Idx>, ...ParseBrackets<Rest>]
    : [];

/**
 * Parses a single dot-segment (no dots inside): `'arr[0]'` → `['arr', 0]`.
 * @internal
 */
type ParseSegment<S extends string> =
  S extends `${infer Name}[${infer Idx}]${infer Rest}`
    ? Name extends ''
      ? [BracketKey<Idx>, ...ParseBrackets<Rest>]
      : [Name, BracketKey<Idx>, ...ParseBrackets<Rest>]
    : [S]; // empty string '' becomes [''] — matches runtime empty-key behaviour

/**
 * Converts a dot/bracket path string literal into a `PropertyKey` tuple.
 *
 * - Dot segments produce string keys: `'a.1'` → `['a', '1']`
 * - Bracket segments produce number keys: `'a[1]'` → `['a', 1]`
 *
 * Limitation: edge-case paths handled specially at runtime (empty string `''`,
 * bare `'.'`, consecutive dots `'a..b'`) are not modelled at the type level.
 *
 * @internal
 */
type ParseStringPath<S extends string> =
  string extends S
    ? readonly PropertyKey[] // non-literal string — fall back to untyped
    : S extends `${infer Head}.${infer Tail}`
      ? [...ParseSegment<Head>, ...ParseStringPath<Tail>]
      : ParseSegment<S>;

/**
 * Normalises both path forms into a `PropertyKey` tuple for use with `DeepGet`/`DeepSet`.
 * - `string` literal → parsed via `ParseStringPath`
 * - `readonly PropertyKey[]` → used as-is
 * @internal
 */
export type ParsePath<P extends string | readonly PropertyKey[]> =
  P extends string
    ? ParseStringPath<P>
    : P extends readonly PropertyKey[]
      ? P
      : never;

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
