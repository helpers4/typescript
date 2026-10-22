/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { rotate } from './rotate';

describe('rotate', () => {
  it('is the identity for 0', () => {
    expect(rotate(0)).toEqual({ a: 1, b: 0, c: -0, d: 1, e: 0, f: 0 });
  });

  it('turns clockwise with y pointing down, like CSS', () => {
    const p = applyToPoint(rotate(Math.PI / 2), { x: 1, y: 0 });
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
  });
});
