/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { curry } from './curry';

describe('curry', () => {
  it('arity 1: returns the function unchanged (wraps identity)', () => {
    const fn = (x: number) => x * 2;
    const curried = curry(fn);
    expect(curried(5)).toBe(10);
  });

  it('arity 2: returns a function after first call', () => {
    const add = curry((a: number, b: number) => a + b);
    const add5 = add(5);
    expect(typeof add5).toBe('function');
    expect(add5(3)).toBe(8);
    expect(add5(10)).toBe(15);
  });

  it('arity 3: chains three calls', () => {
    const fn = curry((a: string, b: string, c: string) => `${a}-${b}-${c}`);
    expect(fn('x')('y')('z')).toBe('x-y-z');
  });

  it('arity 4: chains four calls', () => {
    const fn = curry((a: number, b: number, c: number, d: number) => a + b + c + d);
    expect(fn(1)(2)(3)(4)).toBe(10);
  });

  it('each partial application creates an independent closure', () => {
    const add = curry((a: number, b: number) => a + b);
    const add10 = add(10);
    const add20 = add(20);
    expect(add10(5)).toBe(15);
    expect(add20(5)).toBe(25);
    expect(add10(5)).toBe(15); // add10 still works
  });

  it('preserves the return value type (string)', () => {
    const greet = curry((greeting: string, name: string) => `${greeting}, ${name}!`);
    expect(greet('Hello')('World')).toBe('Hello, World!');
  });
});
