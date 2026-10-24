/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { forEachAsync } from './forEachAsync';

describe('forEachAsync', () => {
  it('calls fn for every item', async () => {
    const seen: number[] = [];
    await forEachAsync([1, 2, 3], async (n) => {
      seen.push(n);
    });
    expect(seen.sort()).toEqual([1, 2, 3]);
  });

  it('passes item and index to fn', async () => {
    const calls: [string, number][] = [];
    await forEachAsync(['a', 'b'], (item, index) => {
      calls.push([item, index]);
    });
    expect(calls).toEqual([
      ['a', 0],
      ['b', 1],
    ]);
  });

  it('caps concurrent calls when a limit is given', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    await forEachAsync(
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

  it('resolves to undefined', async () => {
    const result = await forEachAsync([1, 2, 3], () => {});
    expect(result).toBeUndefined();
  });

  it('rejects with the first error thrown', async () => {
    await expect(
      forEachAsync([1, 2, 3], (n) => {
        if (n === 2) throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });

  it('resolves immediately for an empty array', async () => {
    let called = false;
    await forEachAsync([], () => {
      called = true;
    });
    expect(called).toBe(false);
  });

  it('takes the options, with a concurrency and a signal', async () => {
    await expect(forEachAsync([1, 2], async () => {}, { concurrency: 1, signal: new AbortController().signal })).resolves.toBeUndefined();
  });

  it('rejects with the reason of an aborted signal', async () => {
    await expect(forEachAsync([1, 2], async () => {}, { concurrency: 1, signal: AbortSignal.abort('gone') })).rejects.toBe('gone');
  });
});
