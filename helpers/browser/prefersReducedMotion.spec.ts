/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { prefersReducedMotion } from './prefersReducedMotion';

describe('prefersReducedMotion — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('mirrors the media query result', () => {
    fc.assert(fc.property(fc.boolean(), (matches) => {
      vi.stubGlobal('matchMedia', () => ({ matches }));
      expect(prefersReducedMotion()).toBe(matches);
    }));
  });
});
