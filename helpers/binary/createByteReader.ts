/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readLeb128 } from './_leb128';

/**
 * Byte order of a multi-byte value.
 * @since 3.1.8
 */
export type Endian = 'big' | 'little';

const little = (endian: Endian | undefined) => endian === 'little';

/**
 * A reader created by {@link createByteReader}. Every `read*` method returns `undefined` when the
 * data is truncated or invalid, and then leaves the position where it was, so {@link position} is
 * the offset of the read that failed.
 * @since 3.1.8
 */
export interface ByteReader {
  /** The offset of the next byte to read. */
  readonly position: number;
  /** The number of bytes left to read. */
  readonly remaining: number;
  /** Reads one byte. */
  readU8(): number | undefined;
  /** Reads `length` bytes, as a view on the data (no copy). `undefined` for a negative or non-integer length. */
  readBytes(length: number): Uint8Array | undefined;
  /** Reads an unsigned 16-bit integer. `endian` defaults to `'big'`. */
  readU16(endian?: Endian): number | undefined;
  /** Reads an unsigned 32-bit integer. `endian` defaults to `'big'`. */
  readU32(endian?: Endian): number | undefined;
  /** Reads an unsigned 64-bit integer. `endian` defaults to `'big'`. */
  readU64(endian?: Endian): bigint | undefined;
  /** Reads a signed 16-bit integer. `endian` defaults to `'big'`. */
  readI16(endian?: Endian): number | undefined;
  /** Reads a signed 32-bit integer. `endian` defaults to `'big'`. */
  readI32(endian?: Endian): number | undefined;
  /** Reads a signed 64-bit integer. `endian` defaults to `'big'`. */
  readI64(endian?: Endian): bigint | undefined;
  /** Reads a 32-bit float. `endian` defaults to `'big'`. */
  readF32(endian?: Endian): number | undefined;
  /** Reads a 64-bit float. `endian` defaults to `'big'`. */
  readF64(endian?: Endian): number | undefined;
  /** Reads a LEB128 varint of at most 32 bits. */
  readVarU32(): number | undefined;
  /** Reads a LEB128 varint of at most 64 bits (10 bytes). */
  readVarU64(): bigint | undefined;
  /** Reads a zigzag-encoded LEB128 varint of at most 32 bits. */
  readVarI32(): number | undefined;
  /** Reads a zigzag-encoded LEB128 varint of at most 64 bits. */
  readVarI64(): bigint | undefined;
  /** Reads UTF-8 text up to a NUL byte, and skips the NUL. `undefined` when there is no NUL or the text is not valid UTF-8. */
  readCString(): string | undefined;
}

/**
 * Creates a cursor over bytes, for decoding binary formats: fixed-size integers and floats,
 * LEB128 varints (signed ones zigzag-encoded), byte runs and NUL-terminated strings. Mirrors the
 * Rust `bytes::ByteReader` of helpers4.
 *
 * A read never throws on bad data: it returns `undefined` and leaves the position untouched,
 * enough to build a precise error in the caller's own error type.
 *
 * @param data - The bytes to decode
 * @returns A {@link ByteReader} at position `0`
 * @example
 * const reader = createByteReader(new Uint8Array([0x2a, 0xac, 0x02, 0x68, 0x69, 0, 0x01, 0x00]));
 * reader.readU8();        // => 42
 * reader.readVarU32();    // => 300
 * reader.readCString();   // => 'hi'
 * reader.readU16('little'); // => 1
 * reader.readU8();        // => undefined (end of data)
 * @since 3.1.8
 */
export function createByteReader(data: Uint8Array): ByteReader {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let position = 0;

  function fixed<T>(size: number, read: (offset: number) => T): T | undefined {
    if (data.length - position < size) return undefined;
    const value = read(position);
    position += size;
    return value;
  }

  function varint(bits: number): bigint | undefined {
    const result = readLeb128(data, position, bits);
    if (!result) return undefined;
    position = result.end;
    return result.value;
  }

  return {
    get position() {
      return position;
    },
    get remaining() {
      return data.length - position;
    },
    readU8: () => fixed(1, (at) => data[at]!),
    readBytes: (length) => (Number.isSafeInteger(length) && length >= 0 ? fixed(length, (at) => data.subarray(at, at + length)) : undefined),
    readU16: (endian) => fixed(2, (at) => view.getUint16(at, little(endian))),
    readU32: (endian) => fixed(4, (at) => view.getUint32(at, little(endian))),
    readU64: (endian) => fixed(8, (at) => view.getBigUint64(at, little(endian))),
    readI16: (endian) => fixed(2, (at) => view.getInt16(at, little(endian))),
    readI32: (endian) => fixed(4, (at) => view.getInt32(at, little(endian))),
    readI64: (endian) => fixed(8, (at) => view.getBigInt64(at, little(endian))),
    readF32: (endian) => fixed(4, (at) => view.getFloat32(at, little(endian))),
    readF64: (endian) => fixed(8, (at) => view.getFloat64(at, little(endian))),
    readVarU32: () => {
      const value = varint(32);
      return value === undefined ? undefined : Number(value);
    },
    readVarU64: () => varint(64),
    readVarI32: () => {
      const value = varint(32);
      return value === undefined ? undefined : Number((value >> 1n) ^ -(value & 1n));
    },
    readVarI64: () => {
      const value = varint(64);
      return value === undefined ? undefined : (value >> 1n) ^ -(value & 1n);
    },
    readCString: () => {
      const end = data.indexOf(0, position);
      if (end === -1) return undefined;
      try {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(data.subarray(position, end));
        position = end + 1;
        return text;
      } catch {
        return undefined;
      }
    },
  };
}
