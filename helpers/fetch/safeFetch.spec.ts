/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeFetch } from './safeFetch';

describe('safeFetch — property-based', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('always returns null when fetch throws', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (message) => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(message)));
        const result = await safeFetch('https://example.com');
        expect(result).toBeNull();
      })
    );
  });

  it('always returns null when response.ok is false', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 400, max: 599 }), async (status) => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
          ok: false,
          status,
        }));
        const result = await safeFetch('https://example.com');
        expect(result).toBeNull();
      })
    );
  });
});
