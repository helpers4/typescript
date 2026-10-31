/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const ABSOLUTE_HTTP_OR_PROTOCOL_RELATIVE = /^(?:https?:)?\/\//i;
// scheme (optional, for protocol-relative URLs), then the authority: userinfo, host, port.
const AUTHORITY = /^(?:([a-z][a-z\d+.-]*):)?\/\/(?:[^/?#@]*@)?(\[[^\]/?#]*\]|[^/?#:]*)(?::(\d*))?/i;
const DEFAULT_PORTS: Readonly<Record<string, string>> = { http: '80', https: '443' };

// The origin of an absolute or protocol-relative URL, read from the text itself so that no `URL`
// global is needed (GJS and other runtimes have none). `undefined` when there is no host or no
// scheme to compare.
function originOf(url: string, fallbackScheme?: string): string | undefined {
  const match = AUTHORITY.exec(url);
  const scheme = (match?.[1] ?? fallbackScheme)?.toLowerCase();
  if (!match || !scheme || !match[2]) return undefined;
  const port = match[3] && match[3] !== DEFAULT_PORTS[scheme] ? `:${match[3]}` : '';
  return `${scheme}://${match[2].toLowerCase()}${port}`;
}

/**
 * Whether a link points to another origin than `base`: an absolute `http(s)` URL or a
 * protocol-relative one (`//host/path`). Paths, anchors, query strings and non-HTTP schemes
 * (`mailto:`, `tel:`) are never external.
 *
 * Without `base`, any absolute or protocol-relative URL counts as external. With a `base`,
 * a link to the same origin is internal: same scheme, host and port, the default port of the
 * scheme (80 for `http`, 443 for `https`) being the same as no port. A `base` with no scheme and
 * host, or a link with no host, gives `false`.
 *
 * It reads the origin from the text and uses no `URL` global, so it runs on every runtime. A real
 * `URL` is accepted as `base`, as is any object with an `href`.
 *
 * @param url - The link to check
 * @param base - The current origin or page URL to compare with (optional)
 * @returns `true` if the link leaves the origin, `false` otherwise
 * @example
 * isExternal('https://example.com/a')                          // => true
 * isExternal('https://example.com/a', 'https://example.com')   // => false
 * isExternal('//cdn.example.com/a.js', 'https://example.com')  // => true
 * isExternal('/about')                                         // => false
 * isExternal('mailto:me@example.com')                          // => false
 * @since 3.1.4
 */
export function isExternal(url: string, base?: string | { readonly href: string }): boolean {
  const trimmed = url.trim();
  if (!ABSOLUTE_HTTP_OR_PROTOCOL_RELATIVE.test(trimmed)) return false;
  if (base === undefined) return true;
  const baseUrl = (typeof base === 'string' ? base : base.href).trim();
  const baseOrigin = originOf(baseUrl);
  const baseScheme = baseOrigin?.slice(0, baseOrigin.indexOf(':'));
  const origin = originOf(trimmed, baseScheme);
  return baseOrigin !== undefined && origin !== undefined && origin !== baseOrigin;
}
