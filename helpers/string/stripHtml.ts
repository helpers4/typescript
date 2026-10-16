/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', hellip: '…', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', euro: '€',
};

const COMMENTS = /<!--[\s\S]*?-->/g;
const SCRIPT_AND_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const BLOCK_TAGS = /<\/?(?:br|hr|p|div|li|ul|ol|tr|td|th|table|section|article|header|footer|blockquote|pre|h[1-6])\b[^>]*>/gi;
const TAGS = /<\/?[a-z][^>]*>/gi;
const ENTITIES = /&(?:#(\d+)|#[xX]([\da-fA-F]+)|([a-zA-Z]+));/g;

function decodeEntity(entity: string, dec?: string, hex?: string, name?: string): string {
  if (name !== undefined) return NAMED_ENTITIES[name] ?? entity;
  const code = dec !== undefined ? Number(dec) : parseInt(hex as string, 16);
  // Lone surrogates and out-of-range values are not characters: leave the entity as written.
  return code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) ? entity : String.fromCodePoint(code);
}

/** Replaces `pattern` repeatedly until the text stops changing. */
function removeAll(text: string, pattern: RegExp, replacement: string = ''): string {
  let previous: string;
  do {
    previous = text;
    text = text.replace(pattern, replacement);
  } while (text !== previous);
  return text;
}

/**
 * Plain text of an HTML fragment: tags removed, `<script>`, `<style>` and comments dropped
 * with their content, entities decoded (a common named subset, plus decimal and hex
 * numeric ones) and whitespace collapsed and trimmed. Block-level tags and `<br>` count as
 * a space, so `<p>a</p><p>b</p>` gives `a b`.
 *
 * **Not a sanitizer**: this is for text extraction. Never use its output to make HTML safe,
 * use {@link escapeHtml} for that.
 *
 * @param html - The HTML fragment
 * @returns The plain text
 * @example
 * stripHtml('<p>Hello&nbsp;<b>world</b> &amp; co</p>')
 * // => 'Hello world & co'
 * @example
 * stripHtml('<ul><li>one</li><li>two</li></ul>')
 * // => 'one two'
 * @since next
 */
export function stripHtml(html: string): string {
  // Removing a tag can splice its neighbours into a new one ("<scr<script></script>ipt>"),
  // so each removal is repeated until it changes nothing, and the whole sequence too:
  // every pass only shortens the string, so it ends.
  let text = html;
  let previous: string;
  do {
    previous = text;
    text = removeAll(text, COMMENTS);
    text = removeAll(text, SCRIPT_AND_STYLE);
    text = removeAll(text, BLOCK_TAGS, ' ');
    text = removeAll(text, TAGS);
  } while (text !== previous);
  return text
    .replace(ENTITIES, decodeEntity)
    .replace(/\s+/g, ' ')
    .trim();
}
