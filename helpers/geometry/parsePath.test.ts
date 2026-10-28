/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parsePath } from './parsePath';

describe('parsePath', () => {
  it('returns no command for blank data', () => {
    expect(parsePath('')).toEqual([]);
    expect(parsePath('  ,\n')).toEqual([]);
  });

  it('keeps the letters and their case', () => {
    expect(parsePath('M0 0h10v10z')).toEqual([
      { type: 'M', values: [0, 0] },
      { type: 'h', values: [10] },
      { type: 'v', values: [10] },
      { type: 'z', values: [] },
    ]);
  });

  it('splits a repeated command, a repeated move being a line', () => {
    expect(parsePath('M0 0 1 1 2 2L3 3 4 4')).toEqual([
      { type: 'M', values: [0, 0] },
      { type: 'L', values: [1, 1] },
      { type: 'L', values: [2, 2] },
      { type: 'L', values: [3, 3] },
      { type: 'L', values: [4, 4] },
    ]);
    expect(parsePath('m0 0 1 1 2 2').map((c) => c.type)).toEqual(['m', 'l', 'l']);
  });

  it('reads glued numbers, exponents and any separator', () => {
    expect(parsePath('M1-2.5.5.5L1e-1,+2E2').map((c) => c.values)).toEqual([[1, -2.5], [0.5, 0.5], [0.1, 200]]);
  });

  it('reads arc flags glued to the next number', () => {
    expect(parsePath('M0 0a1 1 0 011 1')).toEqual([
      { type: 'M', values: [0, 0] },
      { type: 'a', values: [1, 1, 0, 0, 1, 1, 1] },
    ]);
  });

  it('accepts a number such as "3." and ".5"', () => {
    expect(parsePath('M3. .5')[0]!.values).toEqual([3, 0.5]);
  });

  it('rejects data that does not start with a move', () => {
    expect(() => parsePath('L0 0')).toThrow(SyntaxError);
  });

  it('rejects an unknown letter', () => {
    expect(() => parsePath('M0 0 X')).toThrow(/unexpected "X"/);
  });

  it('rejects missing numbers and bad flags', () => {
    expect(() => parsePath('M0')).toThrow(/expected a number/);
    expect(() => parsePath('M0 0 A1 1 0 2 1 1 1')).toThrow(/expected a flag/);
  });
});
