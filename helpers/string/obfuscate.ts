/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toBase64 } from './toBase64';

/**
 * Hides a text from anything that reads the raw page source: the text is reversed (by Unicode
 * code point, so emoji stay whole) and written as unpadded base64url. Typical use: an e-mail
 * address rebuilt on click, so naive scrapers do not find it. {@link deobfuscate} reverses it.
 *
 * It works the same in Node.js and in browsers (no `Buffer`, no `btoa`), for any text, non-ASCII
 * included. A lone surrogate, which is not valid text, comes back as U+FFFD.
 *
 * **This is not security.** It only stops scrapers that look at the HTML as it is; anyone can undo
 * it. Never use it for secrets.
 *
 * @param text - The text to hide
 * @returns A base64url token, with no `=` padding
 * @example
 * obfuscate('me@example.com') // => 'bW9jLmVscG1heGVAZW0'
 * @since 3.1.9
 */
export function obfuscate(text: string): string {
  return toBase64(Array.from(text).toReversed().join(''), { urlSafe: true });
}
