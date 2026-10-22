/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Whether the document currently matches a CSS media query.
 *
 * Outside a browser (no `matchMedia`, e.g. during server-side rendering), it returns `false`.
 *
 * @param query - A media query, e.g. `'(min-width: 600px)'`
 * @returns `true` if the query matches now
 * @example
 * matchesMedia('(prefers-color-scheme: dark)') // => true in dark mode
 * @since next
 */
export function matchesMedia(query: string): boolean {
  return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia(query).matches;
}
