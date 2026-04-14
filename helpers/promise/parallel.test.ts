/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parallel } from './parallel';

describe('parallel', () => {
  it('should resolve all functions', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
    const result = await parallel(fns, 2);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should preserve order of results', async () => {
    const fns = [
      () => new Promise<number>(r => setTimeout(() => r(1), 50)),
      () => Promise.resolve(2),
      () => new Promise<number>(r => setTimeout(() => r(3), 10)),
    ];
    const result = await parallel(fns, 2);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should respect concurrency limit', async () => {
    let running = 0;
    let maxRunning = 0;

    const createFn = (value: number) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise(r => setTimeout(r, 20));
      running--;
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3), createFn(4), createFn(5)];
    const result = await parallel(fns, 2);

    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it('should work with limit of 1 (sequential)', async () => {
    const order: number[] = [];
    const createFn = (value: number) => async () => {
      order.push(value);
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3)];
    const result = await parallel(fns, 1);

    expect(result).toEqual([1, 2, 3]);
    expect(order).toEqual([1, 2, 3]);
  });

  it('should work with limit greater than array length', async () => {
    const fns = [() => Promise.resolve('a'), () => Promise.resolve('b')];
    const result = await parallel(fns, 10);
    expect(result).toEqual(['a', 'b']);
  });

  it('should handle empty array', async () => {
    const result = await parallel([], 3);
    expect(result).toEqual([]);
  });

  it('should reject if any function rejects', async () => {
    const fns = [
      () => Promise.resolve(1),
      () => Promise.reject(new Error('fail')),
      () => Promise.resolve(3),
    ];

    await expect(parallel(fns, 2)).rejects.toThrow('fail');
  });

  it('should clamp limit to at least 1', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    const result = await parallel(fns, 0);
    expect(result).toEqual([1, 2]);
  });

  it('should floor fractional limit', async () => {
    let running = 0;
    let maxRunning = 0;

    const createFn = (value: number) => async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise(r => setTimeout(r, 20));
      running--;
      return value;
    };

    const fns = [createFn(1), createFn(2), createFn(3), createFn(4)];
    const result = await parallel(fns, 2.9);

    expect(result).toEqual([1, 2, 3, 4]);
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it('should fallback to 1 for NaN limit', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    const result = await parallel(fns, NaN);
    expect(result).toEqual([1, 2]);
  });

  it('should fallback to 1 for Infinity limit', async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    const result = await parallel(fns, Infinity);
    expect(result).toEqual([1, 2]);
  });
});
