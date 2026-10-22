/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { intersection } from './intersection';

const square = { x: 0, y: 0, width: 10, height: 10 };

describe('intersection', () => {
  it('returns the overlapping area', () => {
    expect(intersection(square, { x: 5, y: 5, width: 10, height: 10 })).toEqual({ x: 5, y: 5, width: 5, height: 5 });
  });

  it('returns the inner rectangle when one contains the other', () => {
    expect(intersection(square, { x: 2, y: 3, width: 1, height: 1 })).toEqual({ x: 2, y: 3, width: 1, height: 1 });
  });

  it('returns undefined for touching or separate rectangles', () => {
    expect(intersection(square, { x: 10, y: 0, width: 5, height: 5 })).toBeUndefined();
    expect(intersection(square, { x: 0, y: 10, width: 5, height: 5 })).toBeUndefined();
    expect(intersection(square, { x: 20, y: 20, width: 5, height: 5 })).toBeUndefined();
  });
});
