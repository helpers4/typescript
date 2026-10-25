/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { STANDARD_ALPHABET, URL_SAFE_ALPHABET } from './_base64Alphabet';

/**
 * Options for {@link toBase64}.
 * @since next
 */
export interface ToBase64Options {
  /** Use the URL and filename safe alphabet (`-` and `_` instead of `+` and `/`, RFC 4648 §5). Defaults to `false`. */
  urlSafe?: boolean;
  /** Pad the result with `=` to a multiple of 4 characters. Defaults to `true`, or to `false` when `urlSafe` is set. */
  padding?: boolean;
}

/**
 * Encodes a string (as UTF-8) or raw bytes to Base64, without relying on `btoa` or `Buffer`, so it
 * behaves the same in a browser, Node.js and GJS.
 *
 * @param input - The text to encode as UTF-8, or the bytes to encode as they are
 * @param options - The URL-safe alphabet and the padding — see {@link ToBase64Options}
 * @returns The Base64 text
 * @example
 * toBase64('héllo') // => 'aMOpbGxv'
 * @example
 * toBase64(new Uint8Array([251, 255]), { urlSafe: true }) // => '-_8'
 * @since next
 */
export function toBase64(input: string | Uint8Array, options: ToBase64Options = {}): string {
  const { urlSafe = false, padding = !urlSafe } = options;
  const alphabet = urlSafe ? URL_SAFE_ALPHABET : STANDARD_ALPHABET;
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;

  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const chunk = (bytes[i]! << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += alphabet[(chunk >> 18) & 63]! + alphabet[(chunk >> 12) & 63]!;
    out += i + 1 < bytes.length ? alphabet[(chunk >> 6) & 63]! : padding ? '=' : '';
    out += i + 2 < bytes.length ? alphabet[chunk & 63]! : padding ? '=' : '';
  }
  return out;
}
