/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { defer } from './defer';

describe('defer (property-based)', () => {
  it('all registered callbacks are called exactly once', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 0, max: 10 }), async (n) => {
        const calls: number[] = [];
        await defer(async (d) => {
          for (let i = 0; i < n; i++) {
            const idx = i;
            d(() => calls.push(idx));
          }
        });
        expect(calls.length).toBe(n);
      }),
    );
  });

  it('callbacks are called in reverse registration order (LIFO)', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 8 }), async (n) => {
        const order: number[] = [];
        await defer(async (d) => {
          for (let i = 0; i < n; i++) {
            const idx = i;
            d(() => order.push(idx));
          }
        });
        const expected = Array.from({ length: n }, (_, i) => n - 1 - i);
        expect(order).toEqual(expected);
      }),
    );
  });

  it('callbacks always run even when main function throws', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 5 }), async (n) => {
        let callCount = 0;
        await defer(async (d) => {
          for (let i = 0; i < n; i++) {
            d(() => callCount++);
          }
          throw new Error('test error');
        }).catch(() => {});
        expect(callCount).toBe(n);
      }),
    );
  });
});
