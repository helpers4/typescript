/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const HEX: string[] = [];
for (let i = 0; i < 256; i++) {
  HEX.push(i.toString(16).padStart(2, '0'));
}

/**
 * Generates a UUID v7 string (RFC 9562).
 * UUID v7 embeds a Unix timestamp in milliseconds, making it
 * chronologically sortable while retaining randomness.
 * @returns A UUID v7 string in the format `xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx`
 * @example
 * uuid7()
 * // => "019077e0-5c70-7b3a-8a1f-3e4d5b6c7d8e"
 * @since 2.0.0
 */
export function uuid7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const ms = Date.now();

  // 48-bit timestamp (big-endian)
  bytes[0] = (ms / 0x10000000000) & 0xff;
  bytes[1] = (ms / 0x100000000) & 0xff;
  bytes[2] = (ms / 0x1000000) & 0xff;
  bytes[3] = (ms / 0x10000) & 0xff;
  bytes[4] = (ms / 0x100) & 0xff;
  bytes[5] = ms & 0xff;

  // Version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Variant 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return (
    HEX[bytes[0]] +
    HEX[bytes[1]] +
    HEX[bytes[2]] +
    HEX[bytes[3]] +
    '-' +
    HEX[bytes[4]] +
    HEX[bytes[5]] +
    '-' +
    HEX[bytes[6]] +
    HEX[bytes[7]] +
    '-' +
    HEX[bytes[8]] +
    HEX[bytes[9]] +
    '-' +
    HEX[bytes[10]] +
    HEX[bytes[11]] +
    HEX[bytes[12]] +
    HEX[bytes[13]] +
    HEX[bytes[14]] +
    HEX[bytes[15]]
  );
}
