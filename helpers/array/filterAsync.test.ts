/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { filterAsync } from './filterAsync';

describe('filterAsync', () => {
  it('keeps items whose predicate resolves truthy, in original order', async () => {
    const result = await filterAsync([1, 2, 3, 4], async (n) => n % 2 === 0);
    expect(result).toEqual([2, 4]);
  });

  it('passes item and index to predicate', async () => {
    const calls: [number, number][] = [];
    await filterAsync([10, 20, 30], (item, index) => {
      calls.push([item, index]);
      return true;
    });
    expect(calls).toEqual([
      [10, 0],
      [20, 1],
      [30, 2],
    ]);
  });

  it('caps concurrent predicate calls when a limit is given', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    await filterAsync(
      [1, 2, 3, 4, 5],
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 5));
        concurrent--;
        return true;
      },
      2,
    );
    expect(maxConcurrent).toBe(2);
  });

  it('accepts a sync predicate', async () => {
    const result = await filterAsync([1, 2, 3], (n) => n > 1);
    expect(result).toEqual([2, 3]);
  });

  it('rejects with the first error thrown', async () => {
    await expect(
      filterAsync([1, 2, 3], (n) => {
        if (n === 2) throw new Error('boom');
        return true;
      }),
    ).rejects.toThrow('boom');
  });

  it('resolves to [] for an empty array', async () => {
    expect(await filterAsync([], () => true)).toEqual([]);
  });

  it('resolves to [] when nothing matches', async () => {
    expect(await filterAsync([1, 2, 3], async () => false)).toEqual([]);
  });
});
