/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Produces a union of all value types of an object type `T`.
 *
 * @example
 * type Config = { host: string; port: number; secure: boolean };
 * type ConfigValue = ValueOf<Config>; // string | number | boolean
 *
 * const STATUS = { OK: 200, NOT_FOUND: 404, ERROR: 500 } as const;
 * type StatusCode = ValueOf<typeof STATUS>; // 200 | 404 | 500
 * @since 3.0.0
 */
export type ValueOf<T> = T[keyof T];
