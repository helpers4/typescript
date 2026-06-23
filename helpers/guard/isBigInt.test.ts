/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isBigInt } from './isBigInt';

describe('isBigInt', () => {
  it('should return true for bigints', () => {
    expect(isBigInt(42n)).toBe(true);
    expect(isBigInt(0n)).toBe(true);
    expect(isBigInt(BigInt(100))).toBe(true);
  });

  it('should return false for numbers', () => {
    expect(isBigInt(42)).toBe(false);
    expect(isBigInt(0)).toBe(false);
  });

  it('should return false for non-bigints', () => {
    expect(isBigInt('42')).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
    expect(isBigInt({})).toBe(false);
  });
});
