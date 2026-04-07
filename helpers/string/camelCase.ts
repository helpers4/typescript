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
export function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
