/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { matchesMedia } from './matchesMedia';

describe('matchesMedia — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('never throws and always returns false outside a browser, whatever the query', () => {
    vi.stubGlobal('matchMedia', undefined);
    fc.assert(fc.property(fc.string(), (query) => {
      expect(matchesMedia(query)).toBe(false);
    }));
  });
});
