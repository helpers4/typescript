/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { negate } from './negate';

describe('negate', () => {
  it('returns true when predicate returns false', () => {
    const isEven = (n: number) => n % 2 === 0;
    expect(negate(isEven)(3)).toBe(true);
  });

  it('returns false when predicate returns true', () => {
    const isEven = (n: number) => n % 2 === 0;
    expect(negate(isEven)(4)).toBe(false);
  });

  it('works with multi-argument predicates', () => {
    const gt = (a: number, b: number) => a > b;
    const lte = negate(gt);
    expect(lte(3, 5)).toBe(true);
    expect(lte(5, 3)).toBe(false);
  });

  it('works as a filter predicate', () => {
    const isEmpty = (arr: unknown[]) => arr.length === 0;
    const result = [[], [1], [], [2, 3]].filter(negate(isEmpty));
    expect(result).toEqual([[1], [2, 3]]);
  });

  it('double-negate is equivalent to original predicate', () => {
    const pred = (s: string) => s.length > 3;
    expect(negate(negate(pred))('hello')).toBe(pred('hello'));
    expect(negate(negate(pred))('hi')).toBe(pred('hi'));
  });

  it('works with a zero-argument predicate', () => {
    let flag = false;
    const isFlag = () => flag;
    const notFlag = negate(isFlag);
    expect(notFlag()).toBe(true);
    flag = true;
    expect(notFlag()).toBe(false);
  });
});
