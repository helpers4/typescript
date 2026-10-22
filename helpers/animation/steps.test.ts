/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { steps } from './steps';

describe('steps', () => {
  it('jumps at the end of each step by default', () => {
    const four = steps(4);
    expect([0, 0.24, 0.25, 0.3, 0.99, 1].map(four)).toEqual([0, 0, 0.25, 0.25, 0.75, 1]);
    expect(steps(4, 'end')(0.3)).toBe(0.25);
  });

  it('jumps at the start with jump-start / start', () => {
    expect([0, 0.3, 1].map(steps(4, 'jump-start'))).toEqual([0.25, 0.5, 1]);
    expect(steps(4, 'start')(0)).toBe(0.25);
  });

  it('holds neither end with jump-both, both ends with jump-none', () => {
    expect([0, 0.5, 0.99, 1].map(steps(2, 'jump-both'))).toEqual([1 / 3, 2 / 3, 2 / 3, 1]);
    expect([0, 0.49, 0.5, 1].map(steps(2, 'jump-none'))).toEqual([0, 0, 1, 1]);
  });

  it('clamps the input', () => {
    expect(steps(4)(-1)).toBe(0);
    expect(steps(4)(2)).toBe(1);
  });

  it('rejects invalid counts', () => {
    expect(() => steps(0)).toThrow(RangeError);
    expect(() => steps(1.5)).toThrow(RangeError);
    expect(() => steps(1, 'jump-none')).toThrow(RangeError);
  });
});
