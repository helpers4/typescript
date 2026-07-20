/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mapAsync } from './mapAsync';

describe('mapAsync', () => {
  it('maps every item and preserves input order', async () => {
    const results = await mapAsync([1, 2, 3], async (n) => n * 2);
    expect(results).toEqual([2, 4, 6]);
  });

  it('runs all calls concurrently when no concurrency is given', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    await mapAsync([1, 2, 3, 4], async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 5));
      concurrent--;
    });
    expect(maxConcurrent).toBe(4);
  });

  it('caps concurrent calls when a limit is given', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    await mapAsync(
      [1, 2, 3, 4, 5],
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 5));
        concurrent--;
      },
      2,
    );
    expect(maxConcurrent).toBe(2);
  });

  it('passes item and index to fn', async () => {
    const results = await mapAsync(['a', 'b'], (item, index) => `${item}-${index}`);
    expect(results).toEqual(['a-0', 'b-1']);
  });

  it('rejects with the first error thrown', async () => {
    await expect(
      mapAsync([1, 2, 3], (n) => {
        if (n === 2) throw new Error('boom');
        return n;
      }),
    ).rejects.toThrow('boom');
  });

  it('accepts a sync fn', async () => {
    const results = await mapAsync([1, 2, 3], (n) => n * 10);
    expect(results).toEqual([10, 20, 30]);
  });

  it('resolves to [] for an empty array', async () => {
    expect(await mapAsync([], (n: number) => n)).toEqual([]);
  });

  it('throws RangeError for an invalid concurrency', async () => {
    await expect(mapAsync([1, 2], (n) => n, 0)).rejects.toThrow(RangeError);
  });
});
