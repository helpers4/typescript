/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { decodeImage } from './decodeImage';

describe('decodeImage — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('sets src before decoding, for any URL', async () => {
    await fc.assert(fc.asyncProperty(fc.webUrl(), async (url) => {
      vi.stubGlobal('Image', class {
        src = '';
        decode() { return this.src === url ? Promise.resolve() : Promise.reject(new Error('src not set')); }
      });
      expect((await decodeImage(url)).src).toBe(url);
    }));
  });
});
