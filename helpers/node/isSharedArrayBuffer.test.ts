/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isSharedArrayBuffer } from './isSharedArrayBuffer';

describe('isSharedArrayBuffer', () => {
  it('should return true for SharedArrayBuffer instances', () => {
    expect(isSharedArrayBuffer(new SharedArrayBuffer(8))).toBe(true);
    expect(isSharedArrayBuffer(new SharedArrayBuffer(0))).toBe(true);
  });

  it('should return false for regular ArrayBuffer', () => {
    expect(isSharedArrayBuffer(new ArrayBuffer(8))).toBe(false);
    expect(isSharedArrayBuffer(new ArrayBuffer(0))).toBe(false);
  });

  it('should return false for typed arrays', () => {
    expect(isSharedArrayBuffer(new Uint8Array(8))).toBe(false);
    expect(isSharedArrayBuffer(new Int32Array(4))).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isSharedArrayBuffer(null)).toBe(false);
    expect(isSharedArrayBuffer(undefined)).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isSharedArrayBuffer({})).toBe(false);
    expect(isSharedArrayBuffer([])).toBe(false);
    expect(isSharedArrayBuffer(42)).toBe(false);
    expect(isSharedArrayBuffer('sab')).toBe(false);
  });
});
