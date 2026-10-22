/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Extracts the keys of `T` whose values extend `V`.
 *
 * Optional properties are matched by their non-nullable value type, so an
 * optional `string` property still counts as a `string` key.
 *
 * @example
 * type User = { id: number; name: string; email: string; active: boolean };
 * type StringKeys = KeysOfType<User, string>; // 'name' | 'email'
 * type NumberKeys = KeysOfType<User, number>; // 'id'
 * @since 3.0.0
 */
export type KeysOfType<T, V> = {
  [K in keyof T]-?: NonNullable<T[K]> extends V ? K : never;
}[keyof T];
