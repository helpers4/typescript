/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatPath } from './formatPath';
import { parsePath } from './parsePath';

describe('formatPath', () => {
  it('writes letters glued to their first number, and a space everywhere else', () => {
    expect(formatPath([{ type: 'M', values: [0, 0.5] }, { type: 'L', values: [10, -2] }, { type: 'Z', values: [] }])).toBe(
      'M0 0.5 L10 -2 Z',
    );
  });

  it('rounds to the precision and drops trailing zeros and negative zero', () => {
    expect(formatPath([{ type: 'L', values: [1 / 3, -0.0000001, 2.5] }])).toBe('L0.333333 0 2.5');
    expect(formatPath([{ type: 'L', values: [1 / 3, 1.23456] }], 2)).toBe('L0.33 1.23');
  });

  it('writes nothing for no command', () => {
    expect(formatPath([])).toBe('');
  });

  it('round-trips parsed data', () => {
    const d = 'M0 0 L10 0 A5 5 0 0 1 10 10 Z';
    expect(formatPath(parsePath(d))).toBe(d);
  });
});
