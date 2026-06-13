/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Recursively makes all properties of T optional, including nested objects
 * and array elements.
 *
 * @example
 * type Config = { server: { host: string; port: number }; debug: boolean };
 * type PartialConfig = DeepPartial<Config>;
 * // => { server?: { host?: string; port?: number }; debug?: boolean }
 *
 * @since 2.0.2
 */
export type DeepPartial<T> =
  T extends (infer U)[]
    ? number extends T['length'] ? DeepPartial<U>[] : { [K in keyof T]?: DeepPartial<T[K]> }
    : T extends readonly (infer U)[]
      ? number extends T['length'] ? readonly DeepPartial<U>[] : { readonly [K in keyof T]?: DeepPartial<T[K]> }
      : T extends (...args: never[]) => unknown
        ? T
        : T extends Date | Map<unknown, unknown> | Set<unknown> | Promise<unknown> | RegExp
          ? T
          : T extends object
            ? { [K in keyof T]?: DeepPartial<T[K]> }
            : T;
