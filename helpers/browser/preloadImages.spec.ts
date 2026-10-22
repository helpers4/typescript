/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { preloadImages } from './preloadImages';

describe('preloadImages — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('never rejects, and a failure only affects its own URL', async () => {
    await fc.assert(fc.asyncProperty(fc.array(fc.boolean(), { maxLength: 12 }), async (broken) => {
      vi.stubGlobal('Image', class {
        src = '';
        decode() { return this.src.startsWith('broken') ? Promise.reject(new Error(this.src)) : Promise.resolve(); }
      });
      const urls = broken.map((isBroken, i) => (isBroken ? 'broken' : 'ok') + i);
      const results = await preloadImages(urls, { concurrency: 3 });
      expect(results.map((result) => result.status === 'rejected')).toEqual(broken);
    }));
  });
});
