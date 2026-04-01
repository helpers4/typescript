/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param str - The string to convert into a slug.
 * @returns A lowercase, hyphen-separated slug safe for URLs.
 *
 * @example
 * slugify('Hello World!');
 * // 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
