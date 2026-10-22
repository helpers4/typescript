/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isArrayBuffer } from './isArrayBuffer';

describe('isArrayBuffer', () => {
  it('should return true for ArrayBuffer instances', () => {
    expect(isArrayBuffer(new ArrayBuffer(0))).toBe(true);
    expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true);
    expect(isArrayBuffer(new ArrayBuffer(1024))).toBe(true);
  });

  it('should return false for TypedArray views', () => {
    expect(isArrayBuffer(new Uint8Array(8))).toBe(false);
    expect(isArrayBuffer(new Int32Array(4))).toBe(false);
    expect(isArrayBuffer(new Float64Array(2))).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isArrayBuffer(null)).toBe(false);
    expect(isArrayBuffer(undefined)).toBe(false);
    expect(isArrayBuffer('')).toBe(false);
    expect(isArrayBuffer(42)).toBe(false);
    expect(isArrayBuffer({})).toBe(false);
    expect(isArrayBuffer([])).toBe(false);
    expect(isArrayBuffer(new Blob())).toBe(false);
  });
});
