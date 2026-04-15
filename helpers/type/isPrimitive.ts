/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Union of all JavaScript primitive types.
 * @since 2.0.0
 */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Checks if a value is a JavaScript primitive.
 *
 * Primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
 *
 * @param value - The value to check
 * @returns True if value is a primitive
 * @example
 * isPrimitive('hello')  // => true
 * isPrimitive(42)       // => true
 * isPrimitive(null)     // => true
 * isPrimitive({})       // => false
 * isPrimitive([])       // => false
 * @since 2.0.0
 */
export function isPrimitive(value: unknown): value is Primitive {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
