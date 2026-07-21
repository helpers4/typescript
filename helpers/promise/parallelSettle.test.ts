/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parallelSettle } from './parallelSettle';

describe('parallelSettle', () => {
  it('returns all values as fulfilled when every function resolves', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
    const result = await parallelSettle(fns, 2);
    expect(result).toEqual({ fulfilled: [1, 2, 3], rejected: [] });
  });

  it('separates rejected reasons from fulfilled values', async () => {
    const error = new Error('boom');
    const fns = [() => Promise.resolve(1), () => Promise.reject(error), () => Promise.resolve(3)];
    const result = await parallelSettle(fns, 2);
    expect(result.fulfilled).toEqual([1, 3]);
    expect(result.rejected).toEqual([error]);
  });

  it('returns all reasons as rejected when every function rejects', async () => {
    const errorA = new Error('a');
    const errorB = new Error('b');
    const fns = [() => Promise.reject(errorA), () => Promise.reject(errorB)];
    const result = await parallelSettle(fns, 2);
    expect(result).toEqual({ fulfilled: [], rejected: [errorA, errorB] });
  });

  it('returns empty arrays for an empty input', async () => {
    const result = await parallelSettle([], 3);
    expect(result).toEqual({ fulfilled: [], rejected: [] });
  });

  it('preserves input order for fulfilled values, not completion order', async () => {
    const fns = [
      () => new Promise<number>(resolve => setTimeout(() => resolve(1), 30)),
      () => Promise.resolve(2),
      () => new Promise<number>(resolve => setTimeout(() => resolve(3), 10)),
    ];
    const result = await parallelSettle(fns, 3);
    expect(result.fulfilled).toEqual([1, 2, 3]);
  });

  it('supports non-Error rejection reasons', async () => {
    const fns = [() => Promise.reject('string reason'), () => Promise.resolve(1)];
    const result = await parallelSettle(fns, 2);
    expect(result.rejected).toEqual(['string reason']);
  });

  it('respects the concurrency limit', async () => {
    let running = 0;
    let maxRunning = 0;

    const createFn = (value: number) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise(resolve => setTimeout(resolve, 20));
      running--;
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3), createFn(4), createFn(5)];
    const result = await parallelSettle(fns, 2);

    expect(result.fulfilled).toEqual([1, 2, 3, 4, 5]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it('a failing function frees its slot for the next queued function', async () => {
    let running = 0;
    let maxRunning = 0;

    const createFn = (value: number, shouldReject: boolean) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise(resolve => setTimeout(resolve, 10));
      running--;
      if (shouldReject) throw new Error(`fail-${value}`);
      return value;
    };

    const fns = [
      createFn(1, true),
      createFn(2, false),
      createFn(3, false),
      createFn(4, false),
    ];
    const result = await parallelSettle(fns, 2);

    expect(result.fulfilled).toEqual([2, 3, 4]);
    expect(result.rejected).toEqual([new Error('fail-1')]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it('runs sequentially with a concurrency of 1', async () => {
    const order: number[] = [];
    const createFn = (value: number) => async () => {
      order.push(value);
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3)];
    const result = await parallelSettle(fns, 1);

    expect(result.fulfilled).toEqual([1, 2, 3]);
    expect(order).toEqual([1, 2, 3]);
  });

  it('works with concurrency greater than the array length', async () => {
    const fns = [() => Promise.resolve('a'), () => Promise.resolve('b')];
    const result = await parallelSettle(fns, 10);
    expect(result.fulfilled).toEqual(['a', 'b']);
  });

  it('clamps concurrency to at least 1', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    const result = await parallelSettle(fns, 0);
    expect(result.fulfilled).toEqual([1, 2]);
  });

  it('floors a fractional concurrency', async () => {
    let running = 0;
    let maxRunning = 0;

    const createFn = (value: number) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise(resolve => setTimeout(resolve, 20));
      running--;
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3), createFn(4)];
    const result = await parallelSettle(fns, 2.9);

    expect(result.fulfilled).toEqual([1, 2, 3, 4]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it('falls back to 1 for a NaN concurrency', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    const result = await parallelSettle(fns, NaN);
    expect(result.fulfilled).toEqual([1, 2]);
  });

  it('treats Infinity as no cap, running everything concurrently', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const task = async (n: number) => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 5));
      concurrent--;
      return n;
    };
    const fns = [1, 2].map((n) => () => task(n));
    const result = await parallelSettle(fns, Infinity);
    expect(result.fulfilled).toEqual([1, 2]);
    expect(maxConcurrent).toBe(2);
  });
});
