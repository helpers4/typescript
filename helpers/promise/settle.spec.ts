/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { settle } from './settle';

describe('settle — property-based', () => {
  it('fulfilled.length + rejected.length === promises.length', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.boolean()), async (outcomes: boolean[]) => {
        const promises = outcomes.map((shouldResolve, i) =>
          shouldResolve ? Promise.resolve(i) : Promise.reject(new Error(`fail-${i}`)),
        );
        const result = await settle(promises);
        expect(result.fulfilled.length + result.rejected.length).toBe(outcomes.length);
      }),
    );
  });

  it('fulfilled values are exactly the resolved ones, in order', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.boolean()), async (outcomes: boolean[]) => {
        const expected = outcomes.flatMap((shouldResolve, i) => (shouldResolve ? [i] : []));
        const promises = outcomes.map((shouldResolve, i) =>
          shouldResolve ? Promise.resolve(i) : Promise.reject(new Error(`fail-${i}`)),
        );
        const result = await settle(promises);
        expect(result.fulfilled).toEqual(expected);
      }),
    );
  });
});

describe('settle — contract', () => {
  it('never rejects, even when all inputs reject', async () => {
    await expect(settle([Promise.reject(new Error('boom'))])).resolves.toBeDefined();
  });

  it('empty input resolves to empty partitions', async () => {
    const result = await settle([]);
    expect(result).toEqual({ fulfilled: [], rejected: [] });
  });
});
