/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a string to Title Case.
 * Handles camelCase, PascalCase, kebab-case, snake_case, spaces, and mixed formats.
 * @param str - The string to convert
 * @returns String in Title Case
 * @example
 * titleCase('hello-world')
 * // => 'Hello World'
 * @example
 * titleCase('queryItems')
 * // => 'Query Items'
 * @since 2.0.0
 */
export function titleCase(str: string): string;
export function titleCase(str: undefined): undefined;
export function titleCase(str: null): null;
export function titleCase(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
