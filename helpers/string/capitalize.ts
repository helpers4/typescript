/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link capitalize}.
 */
export interface CapitalizeOptions {
  /**
   * Whether to lowercase all characters after the first.
   * Set to `false` to only uppercase the first character and leave the rest untouched.
   * @default true
   */
  lowercaseRest?: boolean;
}

/**
 * Capitalizes the first letter of a string.
 * By default, lowercases the remaining characters.
 * Pass `{ lowercaseRest: false }` to only uppercase the first character.
 * @param str - The string to capitalize
 * @param options - Options
 * @returns String with first letter uppercased
 * @example
 * capitalize('hello')                          // => 'Hello'
 * capitalize('hELLO')                          // => 'Hello'
 * capitalize('hELLO', { lowercaseRest: false }) // => 'HELLO'
 * @since 1.9.0
 */
export function capitalize(str: string, options?: CapitalizeOptions): string;
export function capitalize(str: undefined, options?: CapitalizeOptions): undefined;
export function capitalize(str: null, options?: CapitalizeOptions): null;
export function capitalize(str: string | undefined | null, options: CapitalizeOptions = {}): string | undefined | null {
  if (str === undefined || str === null) return str;
  const { lowercaseRest = true } = options;
  const rest = lowercaseRest ? str.slice(1).toLowerCase() : str.slice(1);
  return str.charAt(0).toUpperCase() + rest;
}
