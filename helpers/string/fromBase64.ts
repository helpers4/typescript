/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { STANDARD_ALPHABET, URL_SAFE_ALPHABET } from './_base64Alphabet';

const VALUES = /* @__PURE__ */ (() => {
  const table = new Map<string, number>();
  for (let i = 0; i < 64; i++) {
    table.set(STANDARD_ALPHABET[i]!, i);
    table.set(URL_SAFE_ALPHABET[i]!, i);
  }
  return table;
})();

/**
 * Options for {@link fromBase64}.
 * @since 3.1.8
 */
export interface FromBase64Options {
  /** `'string'` (default) decodes the bytes as UTF-8; `'bytes'` returns them as they are. */
  output?: 'string' | 'bytes';
}

/**
 * Decodes Base64 text. Both alphabets are accepted (`+/` and the URL-safe `-_`) and the `=`
 * padding is optional, so it reads whatever {@link toBase64} wrote, and most Base64 found in the wild.
 *
 * @param text - The Base64 text, without whitespace
 * @param options - `{ output: 'bytes' }` to get a `Uint8Array` instead of a string
 * @returns The decoded text (UTF-8), or the bytes
 * @throws {SyntaxError} If `text` is not valid Base64
 * @throws {TypeError} If the bytes are not valid UTF-8 and a string was asked for
 * @example
 * fromBase64('aMOpbGxv') // => 'héllo'
 * @example
 * fromBase64('-_8', { output: 'bytes' }) // => Uint8Array [251, 255]
 * @since 3.1.8
 */
export function fromBase64(text: string, options: FromBase64Options & { output: 'bytes' }): Uint8Array;
export function fromBase64(text: string, options?: FromBase64Options): string;
export function fromBase64(text: string, options: FromBase64Options = {}): string | Uint8Array {
  const body = text.replace(/={1,2}$/, '');
  if (body.length % 4 === 1 || (text.length !== body.length && text.length % 4 !== 0)) {
    throw new SyntaxError('fromBase64: invalid Base64 input');
  }

  const bytes = new Uint8Array(Math.floor((body.length * 3) / 4));
  let bits = 0;
  let acc = 0;
  let at = 0;
  for (const char of body) {
    const value = VALUES.get(char);
    if (value === undefined) throw new SyntaxError('fromBase64: invalid Base64 input');
    acc = (acc << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes[at++] = (acc >> bits) & 255;
    }
  }

  return options.output === 'bytes' ? bytes : new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
