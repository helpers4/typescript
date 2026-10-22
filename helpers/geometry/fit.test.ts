/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fit } from './fit';

const wide = { width: 200, height: 100 };
const square = { width: 100, height: 100 };
const m = (a: number, d: number, e: number, f: number) => ({ a, b: 0, c: 0, d, e, f });

describe('fit', () => {
  it('contains and centers by default', () => {
    expect(fit(wide, square)).toEqual(m(0.5, 0.5, 0, 25));
  });

  it('covers, overflowing on two sides', () => {
    expect(fit(wide, square, { mode: 'cover' })).toEqual(m(1, 1, -50, 0));
  });

  it('fills each axis', () => {
    expect(fit(wide, square, { mode: 'fill' })).toEqual(m(0.5, 1, 0, 0));
  });

  it('does not scale with none', () => {
    expect(fit(wide, square, { mode: 'none' })).toEqual(m(1, 1, -50, 0));
  });

  it('scale-down shrinks but never enlarges', () => {
    expect(fit(wide, square, { mode: 'scale-down' })).toEqual(m(0.5, 0.5, 0, 25));
    expect(fit({ width: 10, height: 10 }, square, { mode: 'scale-down' })).toEqual(m(1, 1, 45, 45));
  });

  it('aligns in the leftover space, without writing -0', () => {
    expect(fit(wide, square, { align: { y: 0 } })).toEqual(m(0.5, 0.5, 0, 0));
    expect(fit(wide, square, { align: { y: 1 } })).toEqual(m(0.5, 0.5, 0, 50));
    const left = fit(wide, square, { mode: 'cover', align: { x: 0 } });
    expect(left).toEqual(m(1, 1, 0, 0));
    expect(Object.is(left.e, -0)).toBe(false);
    expect(fit(wide, square, { mode: 'cover', align: { x: 1 } }).e).toBe(-100);
  });
});
