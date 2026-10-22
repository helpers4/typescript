/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { matchesMedia } from './matchesMedia';

describe('matchesMedia', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('returns whether the query matches', () => {
    const matchMedia = vi.fn((query: string) => ({ matches: query === '(min-width: 1px)' }));
    vi.stubGlobal('matchMedia', matchMedia);
    expect(matchesMedia('(min-width: 1px)')).toBe(true);
    expect(matchesMedia('print')).toBe(false);
    expect(matchMedia).toHaveBeenCalledWith('print');
  });

  it('returns false outside a browser', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(matchesMedia('(min-width: 1px)')).toBe(false);
  });
});
