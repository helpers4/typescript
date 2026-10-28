/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { sha256Hex } from './sha256Hex';

const abc = new TextEncoder().encode('abc');

describe('sha256Hex', () => {
  it('hashes, truncated to 16 digits by default', async () => {
    expect(await sha256Hex(abc)).toBe('ba7816bf8f01cfea');
  });

  it('keeps the requested number of digits', async () => {
    expect(await sha256Hex(abc, 8)).toBe('ba7816bf');
    expect(await sha256Hex(abc, 64)).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('rejects a length outside 1–64', async () => {
    await expect(sha256Hex(abc, 0)).rejects.toBeInstanceOf(RangeError);
    await expect(sha256Hex(abc, 65)).rejects.toBeInstanceOf(RangeError);
    await expect(sha256Hex(abc, 1.5)).rejects.toBeInstanceOf(RangeError);
  });

  it('rejects with a TypeError without Web Crypto', async () => {
    const { vi } = await import('vitest');
    vi.stubGlobal('crypto', undefined);
    try {
      await expect(sha256Hex(abc)).rejects.toBeInstanceOf(TypeError);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
