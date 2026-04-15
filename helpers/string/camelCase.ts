/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts kebab-case to camelCase
 * @param str - The kebab-case string to convert
 * @returns String in camelCase
 * @since 1.9.0
 */
export function camelCase(str: string): string;
export function camelCase(str: undefined): undefined;
export function camelCase(str: null): null;
export function camelCase(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
