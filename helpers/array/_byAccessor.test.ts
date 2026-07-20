/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toByAccessorFn } from './_byAccessor';

describe('toByAccessorFn', () => {
  it('returns the function unchanged when given a function', () => {
    const fn = (item: { n: number }) => item.n;
    expect(toByAccessorFn(fn)).toBe(fn);
  });

  it('resolves a single-key string path', () => {
    expect(toByAccessorFn<{ price: number }>('price')({ price: 42 })).toBe(42);
  });

  it('resolves a dot-notation nested string path', () => {
    expect(toByAccessorFn<{ stats: { score: number } }>('stats.score')({ stats: { score: 7 } })).toBe(7);
  });

  it('resolves a key array path', () => {
    expect(toByAccessorFn<{ stats: { score: number } }>(['stats', 'score'])({ stats: { score: 7 } })).toBe(7);
  });

  it('returns undefined (cast as number) when the path does not resolve', () => {
    expect(toByAccessorFn<{ a: number }>('missing')({ a: 1 })).toBeUndefined();
  });
});
