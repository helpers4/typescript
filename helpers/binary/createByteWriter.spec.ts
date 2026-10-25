/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createByteReader } from './createByteReader';
import { createByteWriter } from './createByteWriter';

const endian = fc.constantFrom('big' as const, 'little' as const);

describe('createByteWriter / createByteReader — property-based', () => {
  it('round-trips fixed-size integers', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 0xffffffff }), fc.integer({ min: -0x80000000, max: 0x7fffffff }), fc.bigInt({ min: -(1n << 63n), max: (1n << 64n) - 1n }), endian, (u32, i32, n64, e) => {
        const unsigned = n64 < 0n ? n64 + (1n << 64n) : n64;
        const reader = createByteReader(createByteWriter().writeU32(u32, e).writeI32(i32, e).writeU64(unsigned, e).toBytes());
        expect(reader.readU32(e)).toBe(u32);
        expect(reader.readI32(e)).toBe(i32);
        expect(reader.readU64(e)).toBe(unsigned);
        expect(reader.remaining).toBe(0);
      }),
    );
  });

  it('round-trips varints', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 0xffffffff }), fc.integer({ min: -0x80000000, max: 0x7fffffff }), fc.bigInt({ min: 0n, max: (1n << 64n) - 1n }), fc.bigInt({ min: -(1n << 63n), max: (1n << 63n) - 1n }), (u32, i32, u64, i64) => {
        const reader = createByteReader(createByteWriter().writeVarU32(u32).writeVarI32(i32).writeVarU64(u64).writeVarI64(i64).toBytes());
        expect(reader.readVarU32()).toBe(u32);
        expect(reader.readVarI32()).toBe(i32);
        expect(reader.readVarU64()).toBe(u64);
        expect(reader.readVarI64()).toBe(i64);
      }),
    );
  });

  it('round-trips floats and strings', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true }), fc.string().filter((s) => !s.includes('\0')), endian, (f, s, e) => {
        const reader = createByteReader(createByteWriter().writeF64(f, e).writeCString(s.toWellFormed()).toBytes());
        expect(reader.readF64(e)).toBe(f);
        expect(reader.readCString()).toBe(s.toWellFormed());
      }),
    );
  });

  it('a reader never throws and never moves on a failed read, whatever the bytes', () => {
    fc.assert(
      fc.property(fc.uint8Array(), (data) => {
        const reader = createByteReader(data);
        for (const read of [reader.readVarU32, reader.readVarU64, reader.readVarI32, reader.readVarI64, reader.readCString, reader.readU64]) {
          const before = reader.position;
          if (read() === undefined) expect(reader.position).toBe(before);
        }
      }),
    );
  });
});
