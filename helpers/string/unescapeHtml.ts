/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** Inverse of the escape map in `escapeHtml.ts`. */
const HTML_UNESCAPES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const HTML_UNESCAPE_REGEX = /&(?:amp|lt|gt|quot|#39);/g;

/**
 * Unescapes the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;`
 * back to `&`, `<`, `>`, `"`, and `'`.
 *
 * This is the exact inverse of {@link escapeHtml} — it only recognizes the
 * five entities that function produces, not the full HTML entity set (no
 * `&nbsp;`, no numeric code points beyond `&#39;`, etc.).
 *
 * @param str - The string to unescape
 * @returns The unescaped string
 * @example
 * unescapeHtml('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
 * // '<script>alert("xss")</script>'
 * @example
 * unescapeHtml(escapeHtml("It's a <test> & more")) === "It's a <test> & more"
 * // => true
 * @since 4.0.0
 */
export function unescapeHtml(str: string): string {
  return str.replace(HTML_UNESCAPE_REGEX, (entity) => HTML_UNESCAPES[entity] as string);
}
