/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { matrixToCss } from './matrixToCss';

describe('matrixToCss', () => {
  it('writes the six entries in CSS order', () => {
    expect(matrixToCss({ a: 2, b: 0, c: 0, d: 2, e: 10, f: -5 })).toBe('matrix(2, 0, 0, 2, 10, -5)');
  });

  it('writes 0 for -0 and keeps fractions', () => {
    expect(matrixToCss({ a: 0.5, b: -0, c: -0, d: 0.5, e: -0, f: 1.25 })).toBe('matrix(0.5, 0, 0, 0.5, 0, 1.25)');
  });
});
