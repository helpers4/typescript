/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Flattens an intersection type into a single readable object type.
 *
 * IDE tooltips for intersections like `A & B & C` often show the raw
 * intersection instead of the resolved shape. Wrapping with `Prettify`
 * forces TypeScript to expand and display the fully-resolved type.
 *
 * Distributes over unions, so each member is prettified independently
 * instead of collapsing to their shared keys.
 *
 * @example
 * type A = { a: number };
 * type B = { b: string };
 * type Merged = A & B;        // shown as "A & B" in IDE
 * type Pretty = Prettify<Merged>; // shown as "{ a: number; b: string }"
 * @since 3.0.0
 */
export type Prettify<T> = T extends unknown ? { [K in keyof T]: T[K] } & {} : never;
