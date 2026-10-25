/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createByteReader } from './createByteReader';

const bytes = (...values: number[]) => new Uint8Array(values);

describe('createByteReader', () => {
  it('reads the documented example', () => {
    const reader = createByteReader(bytes(0x2a, 0xac, 0x02, 0x68, 0x69, 0, 0x01, 0x00));
    expect(reader.readU8()).toBe(42);
    expect(reader.readVarU32()).toBe(300);
    expect(reader.readCString()).toBe('hi');
    expect(reader.readU16('little')).toBe(1);
    expect(reader.readU8()).toBeUndefined();
    expect(reader.position).toBe(8);
    expect(reader.remaining).toBe(0);
  });

  it('tracks position and remaining', () => {
    const reader = createByteReader(bytes(1, 2, 3));
    expect([reader.position, reader.remaining]).toEqual([0, 3]);
    reader.readU8();
    expect([reader.position, reader.remaining]).toEqual([1, 2]);
  });

  it('reads fixed-size integers in both byte orders', () => {
    const data = bytes(0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0);
    expect(createByteReader(data).readU16()).toBe(0x1234);
    expect(createByteReader(data).readU16('big')).toBe(0x1234);
    expect(createByteReader(data).readU16('little')).toBe(0x3412);
    expect(createByteReader(data).readU32()).toBe(0x12345678);
    expect(createByteReader(data).readU32('little')).toBe(0x78563412);
    expect(createByteReader(data).readU64()).toBe(0x123456789abcdef0n);
    expect(createByteReader(data).readU64('little')).toBe(0xf0debc9a78563412n);
  });

  it('reads signed integers', () => {
    const data = bytes(0xff, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff);
    expect(createByteReader(data).readI16()).toBe(-2);
    expect(createByteReader(data).readI16('little')).toBe(-257);
    expect(createByteReader(data).readI32()).toBe(-65537);
    expect(createByteReader(data).readI32('little')).toBe(-257);
    expect(createByteReader(data).readI64()).toBe(-281474976710657n);
    expect(createByteReader(data).readI64('little')).toBe(-257n);
  });

  it('reads floats', () => {
    expect(createByteReader(bytes(0x3f, 0x80, 0, 0)).readF32()).toBe(1);
    expect(createByteReader(bytes(0, 0, 0x80, 0x3f)).readF32('little')).toBe(1);
    expect(createByteReader(bytes(0x3f, 0xf0, 0, 0, 0, 0, 0, 0)).readF64()).toBe(1);
    expect(createByteReader(bytes(0, 0, 0, 0, 0, 0, 0xf0, 0x3f)).readF64('little')).toBe(1);
  });

  it('reads bytes as a view, and rejects bad lengths', () => {
    const data = bytes(1, 2, 3);
    const reader = createByteReader(data);
    expect(reader.readBytes(2)).toEqual(bytes(1, 2));
    expect(reader.readBytes(2)).toBeUndefined();
    expect(reader.readBytes(-1)).toBeUndefined();
    expect(reader.readBytes(0.5)).toBeUndefined();
    expect(reader.position).toBe(2);
    expect(reader.readBytes(1)).toEqual(bytes(3));
  });

  it('respects the offset of a subarray', () => {
    const reader = createByteReader(bytes(9, 9, 0x12, 0x34).subarray(2));
    expect(reader.readU16()).toBe(0x1234);
  });

  it('leaves the position unchanged on a truncated read', () => {
    const reader = createByteReader(bytes(1, 2, 3));
    reader.readU8();
    const reads = [() => reader.readU16(), () => reader.readU32(), () => reader.readU64(), () => reader.readI16(), () => reader.readI64(), () => reader.readF32(), () => reader.readF64()];
    expect(reader.readU16()).toBe(0x0203);
    expect(createByteReader(bytes(1)).readU16()).toBeUndefined();
    for (const read of reads) expect(read()).toBeUndefined();
    expect(reader.position).toBe(3);
    const fresh = createByteReader(bytes(1, 2, 3));
    expect(fresh.readU32()).toBeUndefined();
    expect(fresh.position).toBe(0);
  });

  describe('varints', () => {
    it('reads LEB128 values', () => {
      expect(createByteReader(bytes(0)).readVarU32()).toBe(0);
      expect(createByteReader(bytes(0xe5, 0x8e, 0x26)).readVarU32()).toBe(624485);
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0x0f)).readVarU32()).toBe(0xffffffff);
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01)).readVarU64()).toBe((1n << 64n) - 1n);
    });

    it('reads zigzag-encoded signed values', () => {
      expect(createByteReader(bytes(1)).readVarI32()).toBe(-1);
      expect(createByteReader(bytes(2)).readVarI32()).toBe(1);
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0x0f)).readVarI32()).toBe(-0x80000000);
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01)).readVarI64()).toBe(-(1n << 63n));
      expect(createByteReader(bytes(3)).readVarI64()).toBe(-2n);
    });

    it('rejects truncated and overflowing varints without moving', () => {
      const truncated = createByteReader(bytes(0x80));
      expect(truncated.readVarU32()).toBeUndefined();
      expect(truncated.readVarU64()).toBeUndefined();
      expect(truncated.readVarI32()).toBeUndefined();
      expect(truncated.readVarI64()).toBeUndefined();
      expect(truncated.position).toBe(0);
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0x1f)).readVarU32()).toBeUndefined();
      expect(createByteReader(bytes(0x80, 0x80, 0x80, 0x80, 0x80)).readVarU32()).toBeUndefined();
      expect(createByteReader(bytes(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x02)).readVarU64()).toBeUndefined();
    });
  });

  describe('readCString', () => {
    it('reads up to the NUL and skips it', () => {
      const reader = createByteReader(bytes(0x68, 0x69, 0, 0, 7));
      expect(reader.readCString()).toBe('hi');
      expect(reader.readCString()).toBe('');
      expect(reader.readU8()).toBe(7);
    });

    it('returns undefined without a NUL or for invalid UTF-8, and does not move', () => {
      const reader = createByteReader(bytes(0x68, 0x69));
      expect(reader.readCString()).toBeUndefined();
      expect(createByteReader(bytes(0xff, 0)).readCString()).toBeUndefined();
      expect(reader.position).toBe(0);
    });
  });
});
