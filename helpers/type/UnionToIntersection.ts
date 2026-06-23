/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a union type to an intersection type: `A | B | C` → `A & B & C`.
 *
 * Uses conditional-type distribution and the contravariant position of a
 * function parameter to collapse the union into an intersection.
 *
 * @example
 * type Union = { a: number } | { b: string } | { c: boolean };
 * type Intersection = UnionToIntersection<Union>;
 * // { a: number } & { b: string } & { c: boolean }
 *
 * type Keys = UnionToIntersection<'a' | 'b'>;
 * // 'a' & 'b'  (resolves to never for disjoint literals)
 * @since 3.0.0
 */
// oxlint-disable-line no-explicit-any
export type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never; // oxlint-disable-line no-explicit-any
