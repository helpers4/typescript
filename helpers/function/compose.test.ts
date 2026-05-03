/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { compose } from './compose';
import { pipe } from './pipe';

describe('compose', () => {
  it('applies functions right-to-left', () => {
    const result = compose(
      (x: number) => x * 2,
      (x: number) => x + 1
    )(3);
    expect(result).toBe(8);
  });

  it('with single function behaves like identity', () => {
    const fn = compose((x: number) => x * 10);
    expect(fn(5)).toBe(50);
  });

  it('is the reverse of pipe', () => {
    const add1 = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const sub3 = (x: number) => x - 3;

    const piped = pipe(add1, double, sub3);
    const composed = compose(sub3, double, add1);
    expect(composed(5)).toBe(((5 + 1) * 2) - 3);
    expect(piped).toBeDefined();
  });

  it('chains type transformations', () => {
    const result = compose(
      (s: string) => s + '!',
      String,
      (x: number) => x * 2
    )(21);
    expect(result).toBe('42!');
  });

  it('passes value through 4 functions in reverse order', () => {
    const result = compose(
      (x: number) => x / 2,
      (x: number) => x - 3,
      (x: number) => x * 2,
      (x: number) => x + 1
    )(5);
    // ((5+1)*2-3)/2 = 4.5
    expect(result).toBe(4.5);
  });
});
