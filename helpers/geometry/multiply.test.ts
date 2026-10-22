/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { multiply } from './multiply';
import { rotate } from './rotate';
import { scale } from './scale';
import { translate } from './translate';

describe('multiply', () => {
  it('is the identity for no matrix', () => {
    expect(multiply()).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it('applies the last matrix first', () => {
    expect(applyToPoint(multiply(translate(10, 0), scale(2)), { x: 1, y: 1 })).toEqual({ x: 12, y: 2 });
    expect(applyToPoint(multiply(scale(2), translate(10, 0)), { x: 1, y: 1 })).toEqual({ x: 22, y: 2 });
  });

  it('scales around a point', () => {
    const m = multiply(translate(50, 50), scale(2), translate(-50, -50));
    expect(applyToPoint(m, { x: 50, y: 50 })).toEqual({ x: 50, y: 50 });
    expect(applyToPoint(m, { x: 60, y: 50 })).toEqual({ x: 70, y: 50 });
  });

  it('multiplies the linear part and carries the translation', () => {
    const m = multiply(translate(1, 2), rotate(Math.PI / 2));
    const p = applyToPoint(m, { x: 1, y: 0 });
    expect(p.x).toBeCloseTo(1);
    expect(p.y).toBeCloseTo(3);
  });
});
