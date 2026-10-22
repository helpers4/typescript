/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { rectUnion } from './rectUnion';

describe('rectUnion', () => {
  it('returns undefined for no rectangle', () => {
    expect(rectUnion([])).toBeUndefined();
  });

  it('returns a copy of a single rectangle', () => {
    const r = { x: 1, y: 2, width: 3, height: 4 };
    expect(rectUnion([r])).toEqual(r);
  });

  it('bounds disjoint rectangles', () => {
    expect(rectUnion([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 5, width: 10, height: 10 }]))
      .toEqual({ x: 0, y: 0, width: 30, height: 15 });
  });

  it('handles negative coordinates', () => {
    expect(rectUnion([{ x: -5, y: -5, width: 1, height: 1 }, { x: 0, y: 0, width: 1, height: 1 }]))
      .toEqual({ x: -5, y: -5, width: 6, height: 6 });
  });
});
