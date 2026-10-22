/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { containsPoint } from './containsPoint';

const square = { x: 0, y: 0, width: 10, height: 10 };

describe('containsPoint', () => {
  it('contains inner points and the left and top edges', () => {
    expect(containsPoint(square, { x: 5, y: 5 })).toBe(true);
    expect(containsPoint(square, { x: 0, y: 0 })).toBe(true);
  });

  it('excludes the right and bottom edges, and outside points', () => {
    expect(containsPoint(square, { x: 10, y: 5 })).toBe(false);
    expect(containsPoint(square, { x: 5, y: 10 })).toBe(false);
    expect(containsPoint(square, { x: -1, y: 5 })).toBe(false);
    expect(containsPoint(square, { x: 5, y: -1 })).toBe(false);
  });
});
