/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Constructs a type by omitting all entries of `T` whose values extend `V`.
 *
 * @example
 * type Form = { name: string; age: number; email: string; active: boolean };
 * type NonStringFields = OmitByValue<Form, string>; // { age: number; active: boolean }
 * @since 3.0.0
 */
export type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};
