/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const ABSOLUTE_HTTP_OR_PROTOCOL_RELATIVE = /^(?:https?:)?\/\//i;

/**
 * Whether a link points to another origin than `base`: an absolute `http(s)` URL or a
 * protocol-relative one (`//host/path`). Paths, anchors, query strings and non-HTTP schemes
 * (`mailto:`, `tel:`) are never external.
 *
 * Without `base`, any absolute or protocol-relative URL counts as external. With a `base`,
 * a link to the same origin is internal. An unparseable URL or `base` gives `false`.
 *
 * @param url - The link to check
 * @param base - The current origin or page URL to compare with (optional)
 * @returns `true` if the link leaves the origin, `false` otherwise
 * @example
 * isExternalUrl('https://example.com/a')                          // => true
 * isExternalUrl('https://example.com/a', 'https://example.com')   // => false
 * isExternalUrl('//cdn.example.com/a.js', 'https://example.com')  // => true
 * isExternalUrl('/about')                                         // => false
 * isExternalUrl('mailto:me@example.com')                          // => false
 * @since next
 */
export function isExternalUrl(url: string, base?: string | URL): boolean {
  const trimmed = url.trim();
  if (!ABSOLUTE_HTTP_OR_PROTOCOL_RELATIVE.test(trimmed)) return false;
  if (base === undefined) return true;
  try {
    return new URL(trimmed, base).origin !== new URL(base).origin;
  } catch {
    return false;
  }
}
