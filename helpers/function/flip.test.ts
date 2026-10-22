/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { flip } from './flip';

describe('flip', () => {
  it('swaps the first two arguments', () => {
    const sub = (a: number, b: number) => a - b;
    expect(flip(sub)(3, 10)).toBe(7);
  });

  it('passes remaining arguments through unchanged', () => {
    const fn = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
    expect(flip(fn)('B', 'A', 'C')).toBe('A-B-C');
  });

  it('works with a two-argument function', () => {
    const divide = (a: number, b: number) => a / b;
    expect(flip(divide)(2, 10)).toBe(5);
  });

  it('double-flip restores original argument order', () => {
    const fn = (a: number, b: number) => a - b;
    expect(flip(flip(fn))(5, 3)).toBe(fn(5, 3));
  });

  it('works with functions returning non-primitives', () => {
    const pair = (a: string, b: number): [string, number] => [a, b];
    expect(flip(pair)(42, 'hello')).toEqual(['hello', 42]);
  });

  it('preserves `this` context when called directly', () => {
    const fn = (a: number, b: number) => b - a;
    const flipped = flip(fn);
    expect(flipped(1, 10)).toBe(-9);
    expect(flipped(10, 1)).toBe(9);
  });
});
