/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { writeLeb128 } from './_leb128';
import type { Endian } from './createByteReader';
import { zigzagEncode } from './zigzagEncode';

function integer(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) throw new RangeError(`${name}: ${value} is out of range`);
  return value;
}

function big(value: bigint, min: bigint, max: bigint, name: string): bigint {
  if (value < min || value > max) throw new RangeError(`${name}: ${value} is out of range`);
  return value;
}

const little = (endian: Endian | undefined) => endian === 'little';
const U64_MAX = (1n << 64n) - 1n;
const I64_MIN = -(1n << 63n);
const I64_MAX = (1n << 63n) - 1n;

/**
 * A writer created by {@link createByteWriter}. Every `write*` method returns the writer, to
 * chain, and throws a `RangeError` for a value outside the range of its type.
 * @since next
 */
export interface ByteWriter {
  /** The number of bytes written so far. */
  readonly length: number;
  /** Writes one byte. */
  writeU8(value: number): ByteWriter;
  /** Writes bytes as they are. */
  writeBytes(bytes: Uint8Array): ByteWriter;
  /** Writes an unsigned 16-bit integer. `endian` defaults to `'big'`. */
  writeU16(value: number, endian?: Endian): ByteWriter;
  /** Writes an unsigned 32-bit integer. `endian` defaults to `'big'`. */
  writeU32(value: number, endian?: Endian): ByteWriter;
  /** Writes an unsigned 64-bit integer. `endian` defaults to `'big'`. */
  writeU64(value: bigint, endian?: Endian): ByteWriter;
  /** Writes a signed 16-bit integer. `endian` defaults to `'big'`. */
  writeI16(value: number, endian?: Endian): ByteWriter;
  /** Writes a signed 32-bit integer. `endian` defaults to `'big'`. */
  writeI32(value: number, endian?: Endian): ByteWriter;
  /** Writes a signed 64-bit integer. `endian` defaults to `'big'`. */
  writeI64(value: bigint, endian?: Endian): ByteWriter;
  /** Writes a 32-bit float. `endian` defaults to `'big'`. */
  writeF32(value: number, endian?: Endian): ByteWriter;
  /** Writes a 64-bit float. `endian` defaults to `'big'`. */
  writeF64(value: number, endian?: Endian): ByteWriter;
  /** Writes an unsigned 32-bit integer as a LEB128 varint. */
  writeVarU32(value: number): ByteWriter;
  /** Writes an unsigned 64-bit integer as a LEB128 varint. */
  writeVarU64(value: bigint): ByteWriter;
  /** Writes a signed 32-bit integer as a zigzag-encoded LEB128 varint. */
  writeVarI32(value: number): ByteWriter;
  /** Writes a signed 64-bit integer as a zigzag-encoded LEB128 varint. */
  writeVarI64(value: bigint): ByteWriter;
  /** Writes text as UTF-8 followed by a NUL byte. Throws a `RangeError` if the text contains a NUL. */
  writeCString(text: string): ByteWriter;
  /** A copy of the bytes written so far. */
  toBytes(): Uint8Array;
}

/**
 * Creates a growable buffer to encode binary formats: the counterpart of
 * {@link createByteReader}, with the same types, byte orders and varints.
 *
 * @returns An empty {@link ByteWriter}
 * @example
 * const bytes = createByteWriter().writeU8(42).writeVarU32(300).writeCString('hi').writeU16(1, 'little').toBytes();
 * // => Uint8Array [0x2a, 0xac, 0x02, 0x68, 0x69, 0, 0x01, 0x00]
 * @since next
 */
export function createByteWriter(): ByteWriter {
  let buffer = new Uint8Array(64);
  let view = new DataView(buffer.buffer);
  let length = 0;

  function reserve(size: number): number {
    if (length + size > buffer.length) {
      const grown = new Uint8Array(Math.max(buffer.length * 2, length + size));
      grown.set(buffer.subarray(0, length));
      buffer = grown;
      view = new DataView(buffer.buffer);
    }
    const at = length;
    length += size;
    return at;
  }

  function write(size: number, set: (target: DataView, at: number) => void): ByteWriter {
    const at = reserve(size);
    set(view, at);
    return writer;
  }

  const writer: ByteWriter = {
    get length() {
      return length;
    },
    writeU8: (value) => {
      const byte = integer(value, 0, 255, 'writeU8');
      return write(1, (target, at) => target.setUint8(at, byte));
    },
    writeBytes: (bytes) => {
      const at = reserve(bytes.length);
      buffer.set(bytes, at);
      return writer;
    },
    writeU16: (value, endian) => {
      const n = integer(value, 0, 0xffff, 'writeU16');
      return write(2, (target, at) => target.setUint16(at, n, little(endian)));
    },
    writeU32: (value, endian) => {
      const n = integer(value, 0, 0xffffffff, 'writeU32');
      return write(4, (target, at) => target.setUint32(at, n, little(endian)));
    },
    writeU64: (value, endian) => {
      const n = big(value, 0n, U64_MAX, 'writeU64');
      return write(8, (target, at) => target.setBigUint64(at, n, little(endian)));
    },
    writeI16: (value, endian) => {
      const n = integer(value, -0x8000, 0x7fff, 'writeI16');
      return write(2, (target, at) => target.setInt16(at, n, little(endian)));
    },
    writeI32: (value, endian) => {
      const n = integer(value, -0x80000000, 0x7fffffff, 'writeI32');
      return write(4, (target, at) => target.setInt32(at, n, little(endian)));
    },
    writeI64: (value, endian) => {
      const n = big(value, I64_MIN, I64_MAX, 'writeI64');
      return write(8, (target, at) => target.setBigInt64(at, n, little(endian)));
    },
    writeF32: (value, endian) => write(4, (target, at) => target.setFloat32(at, value, little(endian))),
    writeF64: (value, endian) => write(8, (target, at) => target.setFloat64(at, value, little(endian))),
    writeVarU32: (value) => writer.writeBytes(Uint8Array.from(writeLeb128(BigInt(integer(value, 0, 0xffffffff, 'writeVarU32'))))),
    writeVarU64: (value) => writer.writeBytes(Uint8Array.from(writeLeb128(big(value, 0n, U64_MAX, 'writeVarU64')))),
    writeVarI32: (value) =>
      writer.writeBytes(Uint8Array.from(writeLeb128(zigzagEncode(BigInt(integer(value, -0x80000000, 0x7fffffff, 'writeVarI32')))))),
    writeVarI64: (value) => writer.writeBytes(Uint8Array.from(writeLeb128(zigzagEncode(big(value, I64_MIN, I64_MAX, 'writeVarI64'))))),
    writeCString: (text) => {
      if (text.includes('\0')) throw new RangeError('writeCString: text contains a NUL character');
      return writer.writeBytes(new TextEncoder().encode(text)).writeU8(0);
    },
    toBytes: () => buffer.slice(0, length),
  };
  return writer;
}
