/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { roundedRectPath } from './roundedRectPath';

const box = { x: 0, y: 0, width: 10, height: 10 };

describe('roundedRectPath', () => {
  it('draws a plain rectangle without radius', () => {
    expect(roundedRectPath(box, 0)).toBe('M0 0 L10 0 L10 10 L0 10 L0 0 Z');
  });

  it('rounds the four corners with one radius', () => {
    expect(roundedRectPath({ x: 1, y: 2, width: 10, height: 20 }, 2)).toBe(
      'M3 2 L9 2 A2 2 0 0 1 11 4 L11 20 A2 2 0 0 1 9 22 L3 22 A2 2 0 0 1 1 20 L1 4 A2 2 0 0 1 3 2 Z',
    );
  });

  it('takes a radius per corner, in CSS order', () => {
    expect(roundedRectPath(box, [5, 0, 0, 0])).toBe('M5 0 L10 0 L10 10 L0 10 L0 5 A5 5 0 0 1 5 0 Z');
    expect(roundedRectPath(box, [0, 4, 0, 0])).toBe('M0 0 L6 0 A4 4 0 0 1 10 4 L10 10 L0 10 L0 0 Z');
    expect(roundedRectPath(box, [0, 0, 3, 0])).toBe('M0 0 L10 0 L10 7 A3 3 0 0 1 7 10 L0 10 L0 0 Z');
    expect(roundedRectPath(box, [0, 0, 0, 2])).toBe('M0 0 L10 0 L10 10 L2 10 A2 2 0 0 1 0 8 L0 0 Z');
  });

  it('clamps radii to half the smaller side', () => {
    expect(roundedRectPath(box, 100)).toBe('M5 0 L5 0 A5 5 0 0 1 10 5 L10 5 A5 5 0 0 1 5 10 L5 10 A5 5 0 0 1 0 5 L0 5 A5 5 0 0 1 5 0 Z');
    expect(roundedRectPath({ x: 0, y: 0, width: 20, height: 4 }, 9)).toContain('A2 2');
  });

  it('counts a negative radius as zero', () => {
    expect(roundedRectPath(box, -3)).toBe(roundedRectPath(box, 0));
  });
});
