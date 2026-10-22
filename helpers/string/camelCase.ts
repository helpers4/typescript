/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a string to camelCase.
 * Handles PascalCase, kebab-case, snake_case, spaces, and mixed formats.
 *
 * An embedded run of capitals is treated as an acronym boundary: only its last letter starts
 * the next word, the rest are lowercased (matching lodash's `camelCase` convention) — so an
 * already-camelCase identifier containing an acronym is not left untouched.
 * @param str - The string to convert
 * @returns String in camelCase
 * @example
 * camelCase('hello-world')
 * // => 'helloWorld'
 * camelCase('user_name')
 * // => 'userName'
 * camelCase('userID')
 * // => 'userId' (acronym boundary, not left as-is)
 * @since 1.9.0
 */
export function camelCase(str: string): string;
export function camelCase(str: undefined): undefined;
export function camelCase(str: null): null;
export function camelCase(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  const words = str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (words.length === 0) return '';
  return (
    words[0]!.toLowerCase() +
    words
      .slice(1)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  );
}
