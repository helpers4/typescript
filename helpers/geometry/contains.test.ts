/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { contains } from './contains';

const square = { x: 0, y: 0, width: 10, height: 10 };

describe('contains', () => {
  it('contains inner points and the left and top edges', () => {
    expect(contains(square, { x: 5, y: 5 })).toBe(true);
    expect(contains(square, { x: 0, y: 0 })).toBe(true);
  });

  it('excludes the right and bottom edges, and outside points', () => {
    expect(contains(square, { x: 10, y: 5 })).toBe(false);
    expect(contains(square, { x: 5, y: 10 })).toBe(false);
    expect(contains(square, { x: -1, y: 5 })).toBe(false);
    expect(contains(square, { x: 5, y: -1 })).toBe(false);
  });

  it('contains a rectangle that touches its edges, or itself', () => {
    expect(contains(square, { x: 5, y: 5, width: 5, height: 5 })).toBe(true);
    expect(contains(square, square)).toBe(true);
    expect(contains(square, { x: 3, y: 3, width: 0, height: 0 })).toBe(true);
  });

  it('does not contain a rectangle that sticks out on any side', () => {
    expect(contains(square, { x: -1, y: 0, width: 5, height: 5 })).toBe(false);
    expect(contains(square, { x: 0, y: -1, width: 5, height: 5 })).toBe(false);
    expect(contains(square, { x: 6, y: 0, width: 5, height: 5 })).toBe(false);
    expect(contains(square, { x: 0, y: 6, width: 5, height: 5 })).toBe(false);
  });
});
