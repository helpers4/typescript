/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fromBase64 } from './fromBase64';

/** What {@link obfuscate} writes: the base64url alphabet, no padding. */
const TOKEN = /^[A-Za-z0-9_-]*$/;

/**
 * Reverses {@link obfuscate}. Never throws: a token that `obfuscate` could not have produced
 * (another alphabet, padding, broken length, bytes that are not UTF-8, not a string) gives `null`.
 *
 * @param token - A token returned by {@link obfuscate}
 * @returns The original text, or `null` for an invalid token
 * @example
 * deobfuscate('bW9jLmVscG1heGVAZW0') // => 'me@example.com'
 * deobfuscate('not a token!')        // => null
 * @since next
 */
export function deobfuscate(token: string): string | null {
  if (typeof token !== 'string' || !TOKEN.test(token) || token.length % 4 === 1) return null;
  try {
    return Array.from(fromBase64(token)).toReversed().join('');
  } catch {
    return null;
  }
}
