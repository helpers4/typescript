/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { unary } from './unary';

describe('unary', () => {
  it('fixes the classic .map(parseInt) footgun', () => {
    expect(['1', '2', '3'].map(unary(parseInt))).toEqual([1, 2, 3]);
  });

  it('demonstrates the bug it prevents (for contrast, not asserting unary here)', () => {
    // Documents the exact failure mode unary() fixes.
    expect(['1', '2', '3'].map(parseInt)).toEqual([1, Number.NaN, Number.NaN]);
  });

  it('calls the wrapped function with only the first argument', () => {
    const calls: unknown[][] = [];
    const fn = (...args: unknown[]) => {
      calls.push(args);
      return args.length;
    };
    const wrapped = unary(fn);
    wrapped('a');
    expect(calls).toEqual([['a']]);
  });

  it('returns the wrapped function result', () => {
    const double = unary((n: number) => n * 2);
    expect(double(21)).toBe(42);
  });

  it('discards the index/array arguments Array.prototype.map normally passes', () => {
    const received: unknown[][] = [];
    const wrapped = unary((...args: unknown[]) => {
      received.push(args);
      return args[0];
    });
    [10, 20].map(wrapped);
    expect(received).toEqual([[10], [20]]);
  });
});
