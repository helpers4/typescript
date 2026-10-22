/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { partial } from './partial';

describe('partial', () => {
  it('pre-fills a single argument', () => {
    const multiply = (a: number, b: number) => a * b;
    const double = partial(multiply, 2);
    expect(double(5)).toBe(10);
    expect(double(7)).toBe(14);
  });

  it('pre-fills multiple arguments', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const add10and20 = partial(add3, 10, 20);
    expect(add10and20(5)).toBe(35);
  });

  it('works with string arguments', () => {
    const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
    const hello = partial(greet, 'Hello');
    expect(hello('World')).toBe('Hello, World!');
  });

  it('pre-filled args do not affect independent partial applications', () => {
    const fn = (a: number, b: number) => a - b;
    const sub10 = partial(fn, 10);
    expect(sub10(3)).toBe(7);
    expect(sub10(8)).toBe(2);
  });

  it('supports a 1-arg function (all args pre-filled)', () => {
    const greet = (name: string) => `Hi, ${name}`;
    const greetAlice = partial(greet, 'Alice');
    expect(greetAlice()).toBe('Hi, Alice');
  });
});
