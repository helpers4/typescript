/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Maybe } from './Maybe';

/**
 * Adds `null` to a type (`T | null`).
 *
 * Useful as a shorthand when explicit nullability should be expressed
 * in function signatures or generic constraints.
 *
 * @example
 * type MaybeUser = Nullable<User>; // User | null
 *
 * function findUser(id: string): Nullable<User> { ... }
 * @since 3.0.0
 */
export type Nullable<T> = T | null;

/**
 * Adds `null` and `undefined` to a type (`T | null | undefined`).
 *
 * Alias of {@link Maybe}.
 *
 * @example
 * type OptionalUser = Nullish<User>; // User | null | undefined
 * @since 3.0.0
 */
export type Nullish<T> = Maybe<T>;
