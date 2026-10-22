/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Recursively removes `readonly` from all properties of T, including nested
 * objects, array elements, and tuple positions.
 *
 * @example
 * type Config = { readonly server: { readonly host: string }; readonly tags: readonly string[] };
 * type MutableConfig = DeepWritable<Config>;
 * // => { server: { host: string }; tags: string[] }
 *
 * @example
 * type Point = readonly [x: number, y: number];
 * type MutablePoint = DeepWritable<Point>;
 * // => [x: number, y: number]
 *
 * Note: `Date`, `Map`, `Set`, `Promise`, and `RegExp` are treated as opaque and passed
 * through unchanged. In particular, `DeepWritable<Map<K, V>>` does **not** strip `readonly`
 * from the value type `V` — use a manual mapped type if you need that.
 *
 * @since 2.0.2
 */
export type DeepWritable<T> =
  T extends readonly (infer U)[]
    ? number extends T['length'] ? DeepWritable<U>[] : { -readonly [K in keyof T]: DeepWritable<T[K]> }
    : T extends (...args: never[]) => unknown
      ? T
      : T extends Date | Map<unknown, unknown> | Set<unknown> | Promise<unknown> | RegExp
        ? T
        : T extends object
          ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
          : T;
