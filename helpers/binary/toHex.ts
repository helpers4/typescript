/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const HEX = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

/**
 * Writes bytes as lowercase hexadecimal, two digits per byte. For content keys, hashes and
 * debugging output.
 *
 * @param bytes - The bytes
 * @returns The hex string, twice as long as `bytes`
 * @example
 * toHex(new Uint8Array([0, 15, 255])) // => '000fff'
 * @since 3.1.10
 */
export function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) out += HEX[byte]!;
  return out;
}
