/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Reads a LEB128 varint of at most `bits` bits at `offset`, without any state.
 * @returns The value and the offset just past it, or `undefined` when the data is truncated or
 *   the varint does not fit `bits` bits
 * @ignore
 */
export function readLeb128(data: Uint8Array, offset: number, bits: number): { value: bigint; end: number } | undefined {
  let value = 0n;
  let shift = 0;
  for (let at = offset; at < data.length; at++) {
    const byte = data[at]!;
    const payload = byte & 0x7f;
    // The last group only has room for the bits that are left.
    if (payload >= 1 << Math.min(bits - shift, 7)) return undefined;
    value |= BigInt(payload) << BigInt(shift);
    if ((byte & 0x80) === 0) return { value, end: at + 1 };
    shift += 7;
    if (shift >= bits) return undefined;
  }
  return undefined;
}

/**
 * The LEB128 bytes of an unsigned integer.
 * @ignore
 */
export function writeLeb128(value: bigint): number[] {
  const bytes: number[] = [];
  let rest = value;
  do {
    const payload = Number(rest & 0x7fn);
    rest >>= 7n;
    bytes.push(rest > 0n ? payload | 0x80 : payload);
  } while (rest > 0n);
  return bytes;
}
