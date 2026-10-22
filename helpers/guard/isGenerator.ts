/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a generator object (the result of calling a `function*`).
 *
 * Distinct from {@link isGeneratorFunction}: this predicate targets the
 * *instance* produced by calling a generator function, not the function itself.
 *
 * @param value - The value to check
 * @returns `true` if value is a Generator instance
 * @example
 * function* gen() { yield 1; yield 2; }
 * isGenerator(gen())   // => true
 * isGenerator(gen)     // => false  (function, not instance)
 * isGenerator([1, 2])  // => false
 * @see {@link isGeneratorFunction}
 * @since 2.0.3
 */
export function isGenerator(value: unknown): value is Generator<unknown, unknown, unknown> {
  return Object.prototype.toString.call(value) === '[object Generator]';
}
