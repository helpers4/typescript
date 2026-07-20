/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { resolveConcurrency, runConcurrentEach, runConcurrentMap } from './_concurrentMap';

describe('resolveConcurrency', () => {
  it('returns itemCount when undefined (no cap)', () => {
    expect(resolveConcurrency(undefined, 5)).toBe(5);
  });

  it('returns itemCount for Infinity (no cap)', () => {
    expect(resolveConcurrency(Number.POSITIVE_INFINITY, 5)).toBe(5);
  });

  it('floors a non-integer concurrency', () => {
    expect(resolveConcurrency(2.9, 10)).toBe(2);
  });

  it('clamps concurrency above itemCount down to itemCount', () => {
    expect(resolveConcurrency(100, 3)).toBe(3);
  });

  it('throws RangeError for zero, negative, or NaN', () => {
    expect(() => resolveConcurrency(0, 5)).toThrow(RangeError);
    expect(() => resolveConcurrency(-1, 5)).toThrow(RangeError);
    expect(() => resolveConcurrency(Number.NaN, 5)).toThrow(RangeError);
  });

  it('throws RangeError for negative infinity', () => {
    expect(() => resolveConcurrency(Number.NEGATIVE_INFINITY, 5)).toThrow(RangeError);
  });
});

describe('runConcurrentMap', () => {
  it('preserves input order regardless of completion order', async () => {
    const delays = [30, 10, 20];
    const results = await runConcurrentMap(
      delays,
      (ms) => new Promise<number>((resolve) => setTimeout(() => resolve(ms), ms)),
      undefined,
    );
    expect(results).toEqual([30, 10, 20]);
  });

  it('never runs more than `concurrency` calls at once', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const items = Array.from({ length: 10 }, (_, i) => i);

    await runConcurrentMap(
      items,
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 5));
        concurrent--;
      },
      3,
    );

    expect(maxConcurrent).toBeLessThanOrEqual(3);
  });

  it('rejects with the first error, matching Promise.all', async () => {
    await expect(
      runConcurrentMap(
        [1, 2, 3],
        (n) => {
          if (n === 2) throw new Error('boom');
          return n;
        },
        undefined,
      ),
    ).rejects.toThrow('boom');
  });

  it('passes both item and index to fn', async () => {
    const calls: [string, number][] = [];
    await runConcurrentMap(['a', 'b'], (item, index) => calls.push([item, index]), undefined);
    expect(calls).toEqual([
      ['a', 0],
      ['b', 1],
    ]);
  });

  it('resolves to [] for an empty array', async () => {
    expect(await runConcurrentMap([], () => 1, undefined)).toEqual([]);
    expect(await runConcurrentMap([], () => 1, 2)).toEqual([]);
  });

  it('validates concurrency even for an empty array', async () => {
    await expect(runConcurrentMap([], () => 1, -5)).rejects.toThrow(RangeError);
    await expect(runConcurrentMap([], () => 1, 0)).rejects.toThrow(RangeError);
  });

  it('skips holes in a sparse array, matching Array.prototype.map', async () => {
    const calls: number[] = [];
    const sparse: number[] = [];
    sparse[0] = 1;
    sparse[2] = 3;
    const results = await runConcurrentMap(
      sparse,
      (item, index) => {
        calls.push(index);
        return item * 10;
      },
      undefined,
    );
    expect(calls).toEqual([0, 2]);
    expect(results[0]).toBe(10);
    expect(results[2]).toBe(30);
  });
});

describe('runConcurrentEach', () => {
  it('calls fn for every item without allocating a results array', async () => {
    const seen: number[] = [];
    const result = await runConcurrentEach([1, 2, 3], (n) => {
      seen.push(n);
    }, undefined);
    expect(seen.sort()).toEqual([1, 2, 3]);
    expect(result).toBeUndefined();
  });

  it('never runs more than `concurrency` calls at once', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    await runConcurrentEach(
      Array.from({ length: 10 }, (_, i) => i),
      async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise((r) => setTimeout(r, 5));
        concurrent--;
      },
      3,
    );
    expect(maxConcurrent).toBeLessThanOrEqual(3);
  });

  it('rejects with the first error thrown', async () => {
    await expect(
      runConcurrentEach(
        [1, 2, 3],
        (n) => {
          if (n === 2) throw new Error('boom');
        },
        undefined,
      ),
    ).rejects.toThrow('boom');
  });

  it('skips holes in a sparse array, matching Array.prototype.forEach', async () => {
    const calls: number[] = [];
    const sparse: number[] = [];
    sparse[0] = 1;
    sparse[2] = 3;
    await runConcurrentEach(sparse, (_item, index) => calls.push(index), undefined);
    expect(calls).toEqual([0, 2]);
  });

  it('resolves immediately for an empty array', async () => {
    let called = false;
    await runConcurrentEach([], () => {
      called = true;
    }, undefined);
    expect(called).toBe(false);
  });

  it('validates concurrency even for an empty array', async () => {
    await expect(runConcurrentEach([], () => {}, -5)).rejects.toThrow(RangeError);
    await expect(runConcurrentEach([], () => {}, 0)).rejects.toThrow(RangeError);
  });
});
