/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Splits a string into an array of words.
 *
 * Handles camelCase, PascalCase, SCREAMING_SNAKE_CASE, kebab-case,
 * snake_case, and regular whitespace-separated text. Numbers are
 * treated as word tokens.
 *
 * @param str - The string to split into words.
 * @returns An array of word tokens.
 * @example
 * words('hello world');        // ['hello', 'world']
 * words('camelCaseString');    // ['camel', 'Case', 'String']
 * words('PascalCase');         // ['Pascal', 'Case']
 * words('snake_case');         // ['snake', 'case']
 * words('kebab-case');         // ['kebab', 'case']
 * words('SCREAMING_SNAKE');    // ['SCREAMING', 'SNAKE']
 * words('foo123bar');          // ['foo', '123', 'bar']
 * @since 2.0.0
 */
export function words(str: string): string[] {
  return (
    str
      // Insert boundary before uppercase following lowercase or digit: camelCase → camel Case
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      // Insert boundary between consecutive uppercase and following title-case: XMLParser → XML Parser
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      // Insert boundary between letters and digits
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      // Extract word tokens (alphanumeric sequences)
      .match(/[a-zA-Z\d]+/g) ?? []
  );
}
