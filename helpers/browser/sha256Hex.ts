/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toHex } from '../binary/toHex';

/**
 * The SHA-256 digest of some data as a hexadecimal string, optionally cut short: a compact
 * content key, not a security check (a short prefix is easy to collide).
 *
 * Outside a runtime with Web Crypto (`crypto.subtle`), it rejects with a `TypeError`.
 *
 * @param data - The data to hash
 * @param length - How many hex digits to keep, from `1` to `64`. Defaults to `16`
 * @returns The first `length` digits of the digest, in lowercase
 * @throws {RangeError} (as a rejection) If `length` is not an integer from `1` to `64`
 * @example
 * await sha256Hex(new TextEncoder().encode('abc'), 8) // => 'ba7816bf'
 * @since next
 */
export async function sha256Hex(data: BufferSource, length = 16): Promise<string> {
  if (!Number.isInteger(length) || length < 1 || length > 64) {
    throw new RangeError(`sha256Hex: length must be an integer from 1 to 64, got ${length}`);
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new TypeError('sha256Hex needs Web Crypto (no crypto.subtle)');
  return toHex(new Uint8Array(await subtle.digest('SHA-256', data))).slice(0, length);
}
