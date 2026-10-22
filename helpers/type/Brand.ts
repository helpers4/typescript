/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Brands a base type `T` with a phantom tag `B` to create a nominal type.
 *
 * Two `Brand<string, 'UserId'>` and `Brand<string, 'Email'>` are structurally
 * identical strings at runtime, but TypeScript treats them as distinct types
 * at the call site — preventing accidental mix-ups.
 *
 * Use a const-assertion cast at the creation boundary:
 * ```ts
 * type UserId = Brand<string, 'UserId'>;
 * const toUserId = (s: string): UserId => s as UserId;
 * ```
 *
 * @example
 * type Meter = Brand<number, 'Meter'>;
 * type Second = Brand<number, 'Second'>;
 *
 * declare function speed(distance: Meter, time: Second): number;
 * const d = 100 as Meter;
 * const t = 5 as Second;
 * speed(d, t);   // ✅
 * speed(t, d);   // ✗ Type error — args swapped
 * @since 3.0.0
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };
