/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createByteReader } from './createByteReader';
import { createByteWriter } from './createByteWriter';

const bytes = (...values: number[]) => new Uint8Array(values);

describe('createByteWriter', () => {
  it('writes the documented example, and chains', () => {
    const writer = createByteWriter();
    expect(writer.writeU8(42).writeVarU32(300).writeCString('hi').writeU16(1, 'little')).toBe(writer);
    expect(writer.toBytes()).toEqual(bytes(0x2a, 0xac, 0x02, 0x68, 0x69, 0, 0x01, 0x00));
    expect(writer.length).toBe(8);
  });

  it('writes fixed-size integers in both byte orders', () => {
    expect(createByteWriter().writeU16(0x1234).toBytes()).toEqual(bytes(0x12, 0x34));
    expect(createByteWriter().writeU16(0x1234, 'little').toBytes()).toEqual(bytes(0x34, 0x12));
    expect(createByteWriter().writeU32(0x12345678).toBytes()).toEqual(bytes(0x12, 0x34, 0x56, 0x78));
    expect(createByteWriter().writeU64(0x0102030405060708n, 'little').toBytes()).toEqual(bytes(8, 7, 6, 5, 4, 3, 2, 1));
    expect(createByteWriter().writeI16(-2).toBytes()).toEqual(bytes(0xff, 0xfe));
    expect(createByteWriter().writeI32(-2, 'little').toBytes()).toEqual(bytes(0xfe, 0xff, 0xff, 0xff));
    expect(createByteWriter().writeI64(-2n).toBytes()).toEqual(bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xfe));
  });

  it('writes floats', () => {
    expect(createByteWriter().writeF32(1).toBytes()).toEqual(bytes(0x3f, 0x80, 0, 0));
    expect(createByteWriter().writeF64(1, 'little').toBytes()).toEqual(bytes(0, 0, 0, 0, 0, 0, 0xf0, 0x3f));
  });

  it('writes varints', () => {
    expect(createByteWriter().writeVarU32(0).toBytes()).toEqual(bytes(0));
    expect(createByteWriter().writeVarU32(624485).toBytes()).toEqual(bytes(0xe5, 0x8e, 0x26));
    expect(createByteWriter().writeVarU64((1n << 64n) - 1n).length).toBe(10);
    expect(createByteWriter().writeVarI32(-1).toBytes()).toEqual(bytes(1));
    expect(createByteWriter().writeVarI64(-2n).toBytes()).toEqual(bytes(3));
  });

  it('writes raw bytes and C strings', () => {
    expect(createByteWriter().writeBytes(bytes(1, 2)).writeCString('é').toBytes()).toEqual(bytes(1, 2, 0xc3, 0xa9, 0));
  });

  it('grows past its initial capacity', () => {
    const writer = createByteWriter();
    const big = new Uint8Array(1000).fill(7);
    writer.writeU8(1).writeBytes(big).writeU8(2);
    const out = writer.toBytes();
    expect(out.length).toBe(1002);
    expect([out[0], out[1], out[1000], out[1001]]).toEqual([1, 7, 7, 2]);
    for (let i = 0; i < 100; i++) writer.writeU32(i);
    expect(writer.length).toBe(1402);
  });

  it('toBytes returns a copy', () => {
    const writer = createByteWriter().writeU8(1);
    const out = writer.toBytes();
    out[0] = 9;
    expect(writer.toBytes()).toEqual(bytes(1));
  });

  it('throws a RangeError for values outside the type', () => {
    expect(() => createByteWriter().writeU8(256)).toThrow(RangeError);
    expect(() => createByteWriter().writeU8(-1)).toThrow(RangeError);
    expect(() => createByteWriter().writeU8(1.5)).toThrow(RangeError);
    expect(() => createByteWriter().writeU16(65536)).toThrow(RangeError);
    expect(() => createByteWriter().writeU32(2 ** 32)).toThrow(RangeError);
    expect(() => createByteWriter().writeU64(-1n)).toThrow(RangeError);
    expect(() => createByteWriter().writeI16(32768)).toThrow(RangeError);
    expect(() => createByteWriter().writeI32(2 ** 31)).toThrow(RangeError);
    expect(() => createByteWriter().writeI64(1n << 63n)).toThrow(RangeError);
    expect(() => createByteWriter().writeVarU32(-1)).toThrow(RangeError);
    expect(() => createByteWriter().writeVarU64(1n << 64n)).toThrow(RangeError);
    expect(() => createByteWriter().writeVarI32(2 ** 31)).toThrow(RangeError);
    expect(() => createByteWriter().writeVarI64(1n << 63n)).toThrow(RangeError);
    expect(() => createByteWriter().writeCString('a\0b')).toThrow(RangeError);
  });

  it('is read back by createByteReader', () => {
    const reader = createByteReader(createByteWriter().writeVarI64(-300n).writeF64(0.5).writeCString('ok').toBytes());
    expect(reader.readVarI64()).toBe(-300n);
    expect(reader.readF64()).toBe(0.5);
    expect(reader.readCString()).toBe('ok');
    expect(reader.remaining).toBe(0);
  });
});
