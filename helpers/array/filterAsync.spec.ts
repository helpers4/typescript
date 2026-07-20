/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { filterAsync } from './filterAsync';

describe('filterAsync — property-based', () => {
  it('result is a subset of the input, in original order', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer(), { maxLength: 10 }), async (values) => {
        const result = await filterAsync(values, (n) => n % 2 === 0);
        const expected = values.filter((n) => n % 2 === 0);
        expect(result).toEqual(expected);
      }),
    );
  });

  it('matches the sync filter() when the predicate is effectively sync', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer(), { maxLength: 10 }), async (values) => {
        const viaAsync = await filterAsync(values, async (n) => n > 0);
        const viaSync = values.filter((n) => n > 0);
        expect(viaAsync).toEqual(viaSync);
      }),
    );
  });
});

describe('filterAsync — contract', () => {
  it('empty array resolves to []', async () => {
    expect(await filterAsync([], () => true)).toEqual([]);
  });

  it('all-truthy predicate returns the full array', async () => {
    expect(await filterAsync([1, 2, 3], () => true)).toEqual([1, 2, 3]);
  });
});
