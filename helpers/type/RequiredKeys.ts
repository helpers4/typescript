/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Extracts the required (non-optional) keys of an object type `T`.
 *
 * @example
 * type User = { id: number; name: string; email?: string };
 * type Required = RequiredKeys<User>; // 'id' | 'name'
 * @since 3.0.0
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Extracts the optional keys of an object type `T`.
 *
 * @example
 * type User = { id: number; name: string; email?: string };
 * type Opts = OptionalKeys<User>; // 'email'
 * @since 3.0.0
 */
export type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
