/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { UnsafeKey } from '../_shared/_unsafeKeys.js';
import type { UnionToIntersection } from '../type/UnionToIntersection.js';

// DeepGet/DeepSet are re-exported (not reimplemented) from `type/` — see that
// package for the canonical, publicly-documented definitions. A relative
// cross-category import is safe here: Rollup inlines it into `@helpers4/object`'s
// own bundle at build time (same pattern already used by `guard/isDefined.ts`
// importing `type/Maybe`), so this never becomes an npm-level dependency on
// `@helpers4/type`. Keeping a second, hand-maintained copy here is what caused
// them to silently drift apart before.
export type { DeepGet } from '../type/DeepGet.js';
export type { DeepSet } from '../type/DeepSet.js';

/**
 * Parses a `[n]` bracket index: numeric index strings become `number`, anything else stays `string`.
 * @ignore
 */
type BracketKey<S extends string> = S extends `${number}` ? number : S;

/**
 * Parses consecutive bracket segments: `'[0][1]'` → `[0, 1]`.
 * @ignore
 */
type ParseBrackets<S extends string> =
  S extends `[${infer Idx}]${infer Rest}`
    ? [BracketKey<Idx>, ...ParseBrackets<Rest>]
    : [];

/**
 * Parses a single dot-segment (no dots inside): `'arr[0]'` → `['arr', 0]`.
 * @ignore
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
 * @ignore
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
 * @ignore
 */
export type ParsePath<P extends string | readonly PropertyKey[]> =
  P extends string
    ? ParseStringPath<P>
    : P extends readonly PropertyKey[]
      ? P
      : never;

/**
 * Returns `true` if any key in the tuple is a prototype-polluting string.
 * Used to make `set` return `T` unchanged (instead of a misleading `DeepSet` type)
 * when the path is rejected by the runtime guard.
 * @ignore
 */
export type ContainsUnsafeStringKey<Keys extends readonly PropertyKey[]> =
  Keys extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]]
    ? K extends UnsafeKey
      ? true
      : ContainsUnsafeStringKey<Rest>
    : false;

/**
 * Return type of `mergeDeep`: intersection of all source types.
 *
 * @ignore
 * @example
 * MergeResult<[{ a: number }, { b: string }]>        // { a: number } & { b: string }
 * MergeResult<[{ a: { b: number } }, { a: { c: string } }]>  // { a: { b: number } & { c: string } }
 */
export type MergeResult<T extends object[]> = UnionToIntersection<T[number]>;
