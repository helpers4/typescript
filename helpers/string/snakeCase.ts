/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a string to snake_case.
 * Handles camelCase, PascalCase, kebab-case, spaces, and mixed formats.
 * @param str - The string to convert
 * @returns String in snake_case
 * @example
 * snakeCase('camelCase')
 * // => 'camel_case'
 * @since 2.0.0
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}
