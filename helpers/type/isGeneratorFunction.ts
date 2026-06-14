/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a generator function (a `function*` declaration or expression).
 *
 * Distinct from {@link isGenerator}: this predicate targets the *function* itself,
 * not the iterator it produces when called.
 *
 * @param value - The value to check
 * @returns `true` if value is a GeneratorFunction
 * @example
 * function* gen() { yield 1; }
 * isGeneratorFunction(gen)      // => true
 * isGeneratorFunction(gen())    // => false  (instance, not function)
 * isGeneratorFunction(() => {}) // => false
 * @see {@link isGenerator}
 * @since next
 */
export function isGeneratorFunction(value: unknown): value is GeneratorFunction {
  return Object.prototype.toString.call(value) === '[object GeneratorFunction]';
}
