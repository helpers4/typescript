/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { paginate } from './paginate';

describe('paginate — property-based', () => {
  it('returns every item of a finite source, whatever the page size', async () => {
    await fc.assert(fc.asyncProperty(fc.array(fc.integer(), { maxLength: 60 }), fc.integer({ min: 1, max: 10 }), fc.boolean(), async (all, size, declare) => {
      const fetchPage = (page: number) => Promise.resolve(all.slice((page - 1) * size, page * size));
      expect(await paginate(fetchPage, declare ? { pageSize: size } : {})).toEqual(all);
    }));
  });

  it('never requests more than maxPages pages', async () => {
    await fc.assert(fc.asyncProperty(fc.integer({ min: 0, max: 8 }), async (maxPages) => {
      let calls = 0;
      await paginate((page) => { calls++; return Promise.resolve([page]); }, { maxPages });
      expect(calls).toBe(maxPages);
    }));
  });
});

describe('paginate — contract', () => {
  it('returns an empty array for an empty source', async () => {
    expect(await paginate(() => Promise.resolve([]))).toEqual([]);
    expect(await paginate(() => Promise.resolve(null))).toEqual([]);
  });
});
