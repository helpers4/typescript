/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';

const square = { x: 0, y: 0, width: 10, height: 10 };

describe('intersects', () => {
  it('is true for overlapping rectangles', () => {
    expect(intersects(square, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(intersects(square, { x: 2, y: 2, width: 1, height: 1 })).toBe(true);
  });

  it('is false for an empty rectangle, even inside another', () => {
    expect(intersects(square, { x: 2, y: 2, width: 0, height: 5 })).toBe(false);
  });

  it('is false for touching rectangles', () => {
    expect(intersects(square, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
    expect(intersects(square, { x: -10, y: 0, width: 10, height: 10 })).toBe(false);
    expect(intersects(square, { x: 0, y: 10, width: 10, height: 10 })).toBe(false);
    expect(intersects(square, { x: 0, y: -10, width: 10, height: 10 })).toBe(false);
  });
});
