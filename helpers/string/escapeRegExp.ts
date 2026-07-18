/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const REGEXP_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

/**
 * Escapes regular expression metacharacters (`. * + ? ^ $ { } ( ) | [ ] \`)
 * in a string so it can be safely embedded in a `RegExp` pattern.
 *
 * Use this before building a `RegExp` from untrusted or dynamic input — without
 * it, characters like `.` or `(` change the pattern's meaning instead of being
 * matched literally.
 *
 * @param str - The string to escape
 * @returns The escaped string, safe to embed in a `RegExp` pattern
 * @example
 * escapeRegExp('1 + 1 = 2?')
 * // => '1 \\+ 1 = 2\\?'
 * @example
 * const search = escapeRegExp(userInput);
 * new RegExp(search).test(text) // userInput is matched literally
 * @since 3.0.0
 */
export function escapeRegExp(str: string): string {
  return str.replace(REGEXP_SPECIAL_CHARS, '\\$&');
}
