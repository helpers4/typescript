/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mapSettled } from './mapSettled';

describe('mapSettled', () => {
  it('returns one settled result per item, in order', async () => {
    const results = await mapSettled([1, 2, 3], (n) => {
      if (n === 2) throw new Error('two');
      return Promise.resolve(n * 10);
    });
    expect(results).toEqual([
      { status: 'fulfilled', value: 10 },
      { status: 'rejected', reason: new Error('two') },
      { status: 'fulfilled', value: 30 },
    ]);
  });

  it('counts a rejected promise as a rejection and passes the index', async () => {
    const results = await mapSettled(['a', 'b'], (item, index) => (index === 0 ? Promise.reject(item) : `${item}${index}`));
    expect(results).toEqual([{ status: 'rejected', reason: 'a' }, { status: 'fulfilled', value: 'b1' }]);
  });

  it('caps concurrency', async () => {
    let active = 0;
    let peak = 0;
    await mapSettled(Array.from({ length: 10 }, (_, i) => i), async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active--;
    }, 3);
    expect(peak).toBe(3);
  });

  it('returns an empty array for an empty input', async () => {
    await expect(mapSettled([], () => 1)).resolves.toEqual([]);
  });

  it('takes the options, with a concurrency and a signal', async () => {
    await expect(mapSettled([1], async (x) => x, { concurrency: 1, signal: new AbortController().signal })).resolves.toEqual([{ status: 'fulfilled', value: 1 }]);
  });

  it('rejects with the reason of an aborted signal', async () => {
    await expect(mapSettled([1], async (x) => x, { concurrency: 1, signal: AbortSignal.abort('gone') })).rejects.toBe('gone');
  });
});
