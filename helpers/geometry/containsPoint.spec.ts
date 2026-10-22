/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { containsPoint } from './containsPoint';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const point = fc.record({ x: coord, y: coord });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('containsPoint — property-based', () => {
  it('contains the top-left corner of any non-empty rectangle, never the bottom-right one', () => {
    fc.assert(fc.property(rect.filter((r) => r.width > 0 && r.height > 0), (r) => {
      expect(containsPoint(r, { x: r.x, y: r.y })).toBe(true);
      expect(containsPoint(r, { x: r.x + r.width, y: r.y + r.height })).toBe(false);
    }));
  });

  it('an empty rectangle contains nothing', () => {
    fc.assert(fc.property(point, point, (corner, p) => {
      expect(containsPoint({ ...corner, width: 0, height: 0 }, p)).toBe(false);
    }));
  });
});
