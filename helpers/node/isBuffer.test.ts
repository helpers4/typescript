/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isBuffer } from './isBuffer';

describe('isBuffer', () => {
  it('should return true for Buffer instances', () => {
    expect(isBuffer(Buffer.from('hello'))).toBe(true);
    expect(isBuffer(Buffer.from([1, 2, 3]))).toBe(true);
    expect(isBuffer(Buffer.alloc(8))).toBe(true);
    expect(isBuffer(Buffer.alloc(0))).toBe(true);
  });

  it('should return false for Uint8Array (not a Buffer)', () => {
    expect(isBuffer(new Uint8Array(8))).toBe(false);
    expect(isBuffer(new Uint8Array([1, 2, 3]))).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isBuffer(null)).toBe(false);
    expect(isBuffer(undefined)).toBe(false);
    expect(isBuffer('')).toBe(false);
    expect(isBuffer('hello')).toBe(false);
    expect(isBuffer(42)).toBe(false);
    expect(isBuffer({})).toBe(false);
    expect(isBuffer([])).toBe(false);
    expect(isBuffer(new ArrayBuffer(8))).toBe(false);
  });
});
