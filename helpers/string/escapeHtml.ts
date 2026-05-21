/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** Map of characters that must be escaped in HTML. */
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_ESCAPE_REGEX = /[&<>"']/g;

/**
 * Escapes the HTML special characters `&`, `<`, `>`, `"`, and `'` in a string.
 *
 * Use this to safely embed untrusted content into HTML attribute values or
 * text nodes without risk of XSS injection.
 *
 * @param str - The string to escape.
 * @returns The escaped string.
 * @example
 * escapeHtml('<script>alert("xss")</script>');
 * // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * @example
 * escapeHtml("It's a <test> & more");
 * // "It&#39;s a &lt;test&gt; &amp; more"
 * @since 2.0.0
 */
export function escapeHtml(str: string): string {
  return str.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPES[char] as string);
}
