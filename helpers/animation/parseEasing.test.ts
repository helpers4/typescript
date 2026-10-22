/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { cubicBezier } from './cubicBezier';
import { parseEasing } from './parseEasing';
import { steps } from './steps';

const sample = (easing: ((t: number) => number) | null) => [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map((t) => easing!(t));

describe('parseEasing', () => {
  it('reads the keywords', () => {
    expect(sample(parseEasing('linear'))).toEqual([0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]);
    expect(parseEasing('linear')!(2)).toBe(1);
    expect(parseEasing('linear')!(-1)).toBe(0);
    expect(sample(parseEasing('ease'))).toEqual(sample(cubicBezier(0.25, 0.1, 0.25, 1)));
    expect(sample(parseEasing('ease-in'))).toEqual(sample(cubicBezier(0.42, 0, 1, 1)));
    expect(sample(parseEasing('ease-out'))).toEqual(sample(cubicBezier(0, 0, 0.58, 1)));
    expect(sample(parseEasing('ease-in-out'))).toEqual(sample(cubicBezier(0.42, 0, 0.58, 1)));
    expect(sample(parseEasing('step-start'))).toEqual(sample(steps(1, 'jump-start')));
    expect(sample(parseEasing('step-end'))).toEqual(sample(steps(1)));
  });

  it('ignores case and spaces', () => {
    expect(parseEasing('  Ease-Out ')).not.toBeNull();
    expect(sample(parseEasing('CUBIC-BEZIER( 0.1 , 0.7,1.0, .1 )'))).toEqual(sample(cubicBezier(0.1, 0.7, 1, 0.1)));
  });

  it('reads cubic-bezier(), with overshooting y values', () => {
    expect(parseEasing('cubic-bezier(0.34, 1.56, 0.64, 1)')!(0.5)).toBeGreaterThan(1);
    expect(parseEasing('cubic-bezier(0, 0, 1e0, 1)')!(0.5)).toBeCloseTo(0.5, 6);
  });

  it('rejects invalid cubic-bezier()', () => {
    expect(parseEasing('cubic-bezier(1.1, 0, 1, 1)')).toBeNull();
    expect(parseEasing('cubic-bezier(0, 0, -0.1, 1)')).toBeNull();
    expect(parseEasing('cubic-bezier(0, 0, 1)')).toBeNull();
    expect(parseEasing('cubic-bezier(0, a, 1, 1)')).toBeNull();
  });

  it('reads steps() with each position', () => {
    expect(sample(parseEasing('steps(4)'))).toEqual(sample(steps(4)));
    for (const position of ['jump-start', 'jump-end', 'jump-none', 'jump-both', 'start', 'end'] as const) {
      expect(sample(parseEasing(`steps(3, ${position})`))).toEqual(sample(steps(3, position)));
    }
  });

  it('rejects invalid steps()', () => {
    expect(parseEasing('steps(0)')).toBeNull();
    expect(parseEasing('steps(1, jump-none)')).toBeNull();
    expect(parseEasing('steps(2.5)')).toBeNull();
    expect(parseEasing('steps(2, middle)')).toBeNull();
    expect(parseEasing('steps(2, end, 3)')).toBeNull();
    expect(parseEasing('steps()')).toBeNull();
  });

  it('reads linear() with explicit, missing and double inputs', () => {
    expect(parseEasing('linear(0, 0.9 50%, 1)')!(0.25)).toBeCloseTo(0.45, 10);
    expect(parseEasing('linear(0, 0.25, 1)')!(0.75)).toBeCloseTo(0.625, 10);
    expect(parseEasing('linear(0, 0.2, 0.6, 1 80%)')!(0.4)).toBeCloseTo(0.4, 10);
    const held = parseEasing('linear(0 0% 50%, 1)')!;
    expect(held(0.25)).toBe(0);
    expect(held(0.75)).toBeCloseTo(0.5, 10);
  });

  it('linear() inputs never go backwards, and the edges are held', () => {
    const jump = parseEasing('linear(0, 0 60%, 1 40%, 1)')!;
    expect(jump(0.59)).toBe(0);
    expect(jump(0.6)).toBe(1);
    const late = parseEasing('linear(0.2 20%, 0.8 80%)')!;
    expect(late(0.1)).toBe(0.2);
    expect(late(0.9)).toBe(0.8);
    expect(late(0.5)).toBeCloseTo(0.5, 10);
  });

  it('rejects invalid linear()', () => {
    expect(parseEasing('linear(1)')).toBeNull();
    expect(parseEasing('linear()')).toBeNull();
    expect(parseEasing('linear(0, x)')).toBeNull();
    expect(parseEasing('linear(0, 1 50)')).toBeNull();
    expect(parseEasing('linear(0, 1 a%)')).toBeNull();
    expect(parseEasing('linear(0 10% 20% 30%, 1)')).toBeNull();
  });

  it('returns null for anything else', () => {
    expect(parseEasing('bounce')).toBeNull();
    expect(parseEasing('spring(1, 100, 10, 0)')).toBeNull();
    expect(parseEasing('ease-out()')).toBeNull();
    expect(parseEasing('')).toBeNull();
    expect(parseEasing('toString')).toBeNull();
  });
});
