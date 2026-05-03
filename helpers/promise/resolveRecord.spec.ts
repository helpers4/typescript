/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { resolveRecord } from './resolveRecord';

describe('resolveRecord — property-based', () => {
  it('result has exactly the same keys as the input array', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 5 })),
        async (keys) => {
          const result = await resolveRecord(keys, async (k) => k.length);
          expect(Object.keys(result).sort()).toEqual([...keys].sort());
        }
      )
    );
  });

  it('mapper is called exactly once per key', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 5 }), { maxLength: 10 }),
        async (keys) => {
          const calls: string[] = [];
          await resolveRecord(keys, async (k) => { calls.push(k); return k; });
          expect(calls.sort()).toEqual([...keys].sort());
        }
      )
    );
  });
});
