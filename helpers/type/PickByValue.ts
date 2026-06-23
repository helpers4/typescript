/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Constructs a type by picking all entries of `T` whose values extend `V`.
 *
 * @example
 * type Form = { name: string; age: number; email: string; active: boolean };
 * type StringFields = PickByValue<Form, string>; // { name: string; email: string }
 * @since 3.0.0
 */
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
