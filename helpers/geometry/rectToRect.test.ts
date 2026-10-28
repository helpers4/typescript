/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToRect } from './applyToRect';
import { rectToRect } from './rectToRect';

describe('rectToRect', () => {
  it('translates and scales one rectangle onto another', () => {
    const from = { x: 0, y: 0, width: 10, height: 10 };
    const to = { x: 5, y: 5, width: 20, height: 10 };
    expect(rectToRect(from, to)).toEqual({ a: 2, b: 0, c: 0, d: 1, e: 5, f: 5 });
    expect(applyToRect(rectToRect(from, to), from)).toEqual(to);
  });

  it('is the identity from a rectangle to itself', () => {
    const r = { x: 3, y: 4, width: 5, height: 6 };
    expect(rectToRect(r, r)).toEqual({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it('only translates an axis without extent', () => {
    expect(rectToRect({ x: 1, y: 1, width: 0, height: 2 }, { x: 4, y: 3, width: 9, height: 4 })).toEqual({
      a: 1,
      b: 0,
      c: 0,
      d: 2,
      e: 3,
      f: 1,
    });
    expect(rectToRect({ x: 1, y: 1, width: 2, height: 0 }, { x: 4, y: 3, width: 4, height: 9 })).toEqual({
      a: 2,
      b: 0,
      c: 0,
      d: 1,
      e: 2,
      f: 2,
    });
  });
});
