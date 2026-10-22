/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { invert } from './invert';
import { multiply } from './multiply';
import { rotate } from './rotate';
import { scale } from './scale';
import { translate } from './translate';

describe('invert', () => {
  it('undoes a translation', () => {
    expect(invert(translate(10, 5))).toEqual(translate(-10, -5));
  });

  it('undoes a combined transform', () => {
    const m = multiply(translate(3, 4), rotate(0.7), scale(2, 3));
    const product = multiply(m, invert(m)!);
    expect(product.a).toBeCloseTo(1);
    expect(product.b).toBeCloseTo(0);
    expect(product.c).toBeCloseTo(0);
    expect(product.d).toBeCloseTo(1);
    expect(product.e).toBeCloseTo(0);
    expect(product.f).toBeCloseTo(0);
  });

  it('returns undefined for a matrix that flattens the plane', () => {
    expect(invert(scale(0))).toBeUndefined();
    expect(invert(scale(1, 0))).toBeUndefined();
    expect(invert({ a: 1, b: 2, c: 2, d: 4, e: 0, f: 0 })).toBeUndefined();
  });

  it('returns undefined when an entry is not finite', () => {
    expect(invert(translate(Number.NaN, 0))).toBeUndefined();
  });

  it('inverts a nearly flat matrix without tolerance', () => {
    expect(invert(scale(1e-9))).toEqual(scale(1e9));
  });
});
