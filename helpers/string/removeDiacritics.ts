/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const COMBINING_DIACRITICAL_MARKS = /[\u0300-\u036f]/g;

/**
 * Removes diacritical marks (accents) from a string, e.g. `'café'` → `'cafe'`.
 *
 * Works by Unicode-decomposing each character into its base letter plus
 * combining marks (`'é'` → `'e'` + a combining acute accent), then
 * stripping the marks. Same technique already used internally by `slugify`.
 *
 * @param str - The string to strip diacritics from
 * @returns The string with diacritics removed
 * @example
 * removeDiacritics('café')   // => 'cafe'
 * removeDiacritics('naïve')  // => 'naive'
 * removeDiacritics('ÉCOLE')  // => 'ECOLE'
 * removeDiacritics('hello')  // => 'hello'  (unchanged, no diacritics)
 * @since next
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFKD').replace(COMBINING_DIACRITICAL_MARKS, '');
}
