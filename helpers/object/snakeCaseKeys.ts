/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { snakeCase } from '../string/snakeCase.js';
import { mapDeep } from './mapDeep.js';

/**
 * Recursively transforms every key of a plain object (including keys nested inside arrays and
 * nested objects) to snake_case. Handles camelCase, PascalCase, kebab-case, and space-separated
 * keys. Non-plain-object values — `Date`, `Map`, `Set`, class instances, primitives — are left
 * untouched, only their position is walked into. An entry whose transformed key is a
 * prototype-polluting string (`__proto__`, `constructor`, `prototype`) is silently skipped,
 * same as the rest of `@helpers4/object`.
 * @param value - The object (or array of objects) to transform
 * @returns A new value with every plain-object key converted to snake_case
 * @example
 * snakeCaseKeys({ userName: 'Alice', homeAddress: { zipCode: '12345' } })
 * // => { user_name: 'Alice', home_address: { zip_code: '12345' } }
 * @since next
 */
export function snakeCaseKeys<T>(value: T): T {
  return mapDeep(value, undefined, snakeCase);
}
