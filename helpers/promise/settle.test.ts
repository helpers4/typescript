/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { settle } from './settle';

describe('settle', () => {
  it('returns all values as fulfilled when every promise resolves', async () => {
    const result = await settle([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
    expect(result).toEqual({ fulfilled: [1, 2, 3], rejected: [] });
  });

  it('separates rejected reasons from fulfilled values', async () => {
    const error = new Error('boom');
    const result = await settle([Promise.resolve(1), Promise.reject(error), Promise.resolve(3)]);
    expect(result.fulfilled).toEqual([1, 3]);
    expect(result.rejected).toEqual([error]);
  });

  it('returns all reasons as rejected when every promise rejects', async () => {
    const errorA = new Error('a');
    const errorB = new Error('b');
    const result = await settle([Promise.reject(errorA), Promise.reject(errorB)]);
    expect(result).toEqual({ fulfilled: [], rejected: [errorA, errorB] });
  });

  it('returns empty arrays for an empty input', async () => {
    const result = await settle([]);
    expect(result).toEqual({ fulfilled: [], rejected: [] });
  });

  it('preserves input order for fulfilled values', async () => {
    const result = await settle([
      new Promise<number>((resolve) => setTimeout(() => resolve(1), 20)),
      Promise.resolve(2),
      new Promise<number>((resolve) => setTimeout(() => resolve(3), 10)),
    ]);
    expect(result.fulfilled).toEqual([1, 2, 3]);
  });

  it('supports non-Error rejection reasons', async () => {
    const result = await settle([Promise.reject('string reason'), Promise.resolve(1)]);
    expect(result.rejected).toEqual(['string reason']);
  });
});
