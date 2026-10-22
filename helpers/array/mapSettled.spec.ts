/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mapSettled } from './mapSettled';

describe('mapSettled — property-based', () => {
  it('never rejects, and each failure stays on its own item', async () => {
    await fc.assert(fc.asyncProperty(fc.array(fc.boolean(), { maxLength: 20 }), fc.integer({ min: 1, max: 5 }), async (fails, concurrency) => {
      const results = await mapSettled(fails, (fail, i) => (fail ? Promise.reject(i) : Promise.resolve(i)), concurrency);
      expect(results.map((r) => r.status === 'rejected')).toEqual(fails);
    }));
  });
});
