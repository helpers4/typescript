/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { resolveRecord } from './resolveRecord';

describe('resolveRecord', () => {
  it('maps keys to their resolved values', async () => {
    const result = await resolveRecord(['a', 'b', 'c'], async (k) => k.toUpperCase());
    expect(result).toEqual({ a: 'A', b: 'B', c: 'C' });
  });

  it('returns an empty object for empty keys array', async () => {
    const mapper = vi.fn(async (k: string) => k);
    const result = await resolveRecord([], mapper);
    expect(result).toEqual({});
    expect(mapper).not.toHaveBeenCalled();
  });

  it('calls mapper concurrently (all start before any resolve)', async () => {
    const started: string[] = [];
    const result = await resolveRecord(['x', 'y', 'z'], async (k) => {
      started.push(k);
      return k.charCodeAt(0);
    });
    expect(started).toHaveLength(3);
    expect(result).toEqual({ x: 120, y: 121, z: 122 });
  });

  it('preserves numeric keys', async () => {
    const result = await resolveRecord([1, 2, 3], async (n) => n * n);
    expect(result[1]).toBe(1);
    expect(result[2]).toBe(4);
    expect(result[3]).toBe(9);
  });

  it('rejects if any mapper rejects', async () => {
    await expect(
      resolveRecord(['ok', 'fail'], async (k) => {
        if (k === 'fail') throw new Error('boom');
        return k;
      })
    ).rejects.toThrow('boom');
  });
});
