/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { removeDiacritics } from './removeDiacritics';

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param str - The string to convert into a slug.
 * @returns A lowercase, hyphen-separated slug safe for URLs.
 *
 * @example
 * slugify('Hello World!');
 * // 'hello-world'
 * @since 2.0.0
 */
export function slugify(str: string): string;
export function slugify(str: undefined): undefined;
export function slugify(str: null): null;
export function slugify(str: string | undefined | null): string | undefined | null {
  if (str === undefined || str === null) return str;
  return removeDiacritics(str)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
