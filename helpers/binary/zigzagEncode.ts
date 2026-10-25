/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const MASK_64 = (1n << 64n) - 1n;

/**
 * Maps a signed 64-bit integer to an unsigned one so that values near zero stay small (`0, -1, 1,
 * -2` become `0, 1, 2, 3`): the "zigzag" mapping of Protocol Buffers, used before writing a signed
 * value as a varint.
 *
 * @param value - A signed integer in the 64-bit range
 * @returns The unsigned zigzag value
 * @throws {RangeError} If `value` does not fit a signed 64-bit integer
 * @example
 * zigzagEncode(-1n) // => 1n
 * zigzagEncode(1n)  // => 2n
 * @since next
 */
export function zigzagEncode(value: bigint): bigint {
  if (value < -(1n << 63n) || value >= 1n << 63n) throw new RangeError('zigzagEncode: value does not fit a signed 64-bit integer');
  return ((value << 1n) ^ (value >> 63n)) & MASK_64;
}
