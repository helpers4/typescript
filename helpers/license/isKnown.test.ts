/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isKnown } from './isKnown';

describe('isKnown', () => {
  it('returns true for a recognized single license', () => {
    expect(isKnown('GPL-3.0-or-later')).toBe(true);
    expect(isKnown('MIT')).toBe(true);
  });

  it('returns true when at least one token in a compound expression is recognized', () => {
    expect(isKnown('custom AND MIT')).toBe(true);
  });

  it('returns false for a non-informative claim', () => {
    expect(isKnown('custom')).toBe(false);
    expect(isKnown('unknown')).toBe(false);
    expect(isKnown('custom:Acme End User License')).toBe(false);
  });

  it('returns false when every token in a compound expression is non-informative', () => {
    expect(isKnown('custom AND unknown')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isKnown('')).toBe(false);
  });
});
