/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 * @since 1.9.0
 */
export function capitalize(str: string): string;
export function capitalize(str: undefined): undefined;
export function capitalize(str: null): null;
export function capitalize(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
