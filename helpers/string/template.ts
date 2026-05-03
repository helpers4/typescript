/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Interpolates `{{key}}` placeholders in a template string with values from
 * a data record. Unknown keys are replaced with an empty string.
 *
 * No `eval` or `Function` constructor is used — substitution is purely
 * regex-based. Nested expressions and logic are intentionally out of scope.
 *
 * @param str - The template string containing `{{key}}` placeholders.
 * @param data - A record mapping placeholder names to replacement values.
 * @returns The template string with all placeholders replaced.
 * @example
 * template('Hello, {{name}}!', { name: 'Alice' });
 * // 'Hello, Alice!'
 * @example
 * template('{{greeting}}, {{name}}! You have {{count}} messages.', {
 *   greeting: 'Hi',
 *   name: 'Bob',
 *   count: 3,
 * });
 * // 'Hi, Bob! You have 3 messages.'
 * @example
 * template('Hello, {{name}}!', {});
 * // 'Hello, !'  (unknown keys become empty string)
 * @since next
 */
export function template(str: string, data: Record<string, unknown>): string {
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => String(data[key] ?? ''));
}
