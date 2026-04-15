/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a string to PascalCase.
 * Handles camelCase, kebab-case, snake_case, spaces, and mixed formats.
 * @param str - The string to convert
 * @returns String in PascalCase
 * @example
 * pascalCase('hello-world')
 * // => 'HelloWorld'
 * @since 2.0.0
 */
export function pascalCase(str: string): string;
export function pascalCase(str: undefined): undefined;
export function pascalCase(str: null): null;
export function pascalCase(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
