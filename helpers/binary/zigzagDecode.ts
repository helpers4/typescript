/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * The inverse of {@link zigzagEncode}: maps an unsigned 64-bit zigzag value back to the signed
 * integer.
 *
 * @param value - An unsigned integer in the 64-bit range
 * @returns The signed integer
 * @throws {RangeError} If `value` does not fit an unsigned 64-bit integer
 * @example
 * zigzagDecode(1n) // => -1n
 * zigzagDecode(2n) // => 1n
 * @since next
 */
export function zigzagDecode(value: bigint): bigint {
  if (value < 0n || value >= 1n << 64n) throw new RangeError('zigzagDecode: value does not fit an unsigned 64-bit integer');
  return (value >> 1n) ^ -(value & 1n);
}
