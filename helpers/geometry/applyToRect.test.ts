/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToRect } from './applyToRect';
import { rotate } from './rotate';
import { scale } from './scale';

describe('applyToRect', () => {
  it('scales a rectangle', () => {
    expect(applyToRect(scale(2), { x: 1, y: 1, width: 2, height: 3 })).toEqual({ x: 2, y: 2, width: 4, height: 6 });
  });

  it('keeps a positive size through a flip', () => {
    expect(applyToRect(scale(-1, 1), { x: 1, y: 0, width: 2, height: 3 })).toEqual({ x: -3, y: 0, width: 2, height: 3 });
  });

  it('grows to the bounding box of a rotated rectangle', () => {
    const box = applyToRect(rotate(Math.PI / 4), { x: 0, y: 0, width: 1, height: 1 });
    expect(box.x).toBeCloseTo(-Math.SQRT1_2);
    expect(box.y).toBeCloseTo(0);
    expect(box.width).toBeCloseTo(Math.SQRT2);
    expect(box.height).toBeCloseTo(Math.SQRT2);
  });
});
