/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts camelCase to kebab-case
 * @param str - The camelCase string to convert
 * @returns String in kebab-case
 * @since 1.9.0
 */
export function kebabCase(str: string): string;
export function kebabCase(str: undefined): undefined;
export function kebabCase(str: null): null;
export function kebabCase(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}
