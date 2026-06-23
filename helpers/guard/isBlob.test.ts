/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isBlob } from './isBlob';

describe('isBlob', () => {
  it('should return true for Blob instances', () => {
    expect(isBlob(new Blob())).toBe(true);
    expect(isBlob(new Blob(['hello']))).toBe(true);
    expect(isBlob(new Blob(['{}'], { type: 'application/json' }))).toBe(true);
  });

  it('should return false for non-Blob values', () => {
    expect(isBlob(null)).toBe(false);
    expect(isBlob(undefined)).toBe(false);
    expect(isBlob('')).toBe(false);
    expect(isBlob(42)).toBe(false);
    expect(isBlob({})).toBe(false);
    expect(isBlob([])).toBe(false);
    expect(isBlob(new ArrayBuffer(8))).toBe(false);
  });
});
