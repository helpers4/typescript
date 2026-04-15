/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a symbol.
 * @param value - The value to check
 * @returns True if value is a symbol
 * @example
 * isSymbol(Symbol('test')) // => true
 * isSymbol(Symbol.iterator) // => true
 * isSymbol('symbol')       // => false
 * @since 2.0.0
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}
