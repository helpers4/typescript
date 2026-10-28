/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { ellipsePath } from './ellipsePath';

describe('ellipsePath', () => {
  it('draws the ellipse in its box with two arcs', () => {
    expect(ellipsePath({ x: 0, y: 0, width: 10, height: 6 })).toBe('M0 3 A5 3 0 0 1 10 3 A5 3 0 0 1 0 3 Z');
  });

  it('draws a circle in a square box, offset', () => {
    expect(ellipsePath({ x: 10, y: 20, width: 4, height: 4 })).toBe('M10 22 A2 2 0 0 1 14 22 A2 2 0 0 1 10 22 Z');
  });
});
