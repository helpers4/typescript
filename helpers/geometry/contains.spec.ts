/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { contains } from './contains';
import { intersection } from './intersection';

const coord = fc.integer({ min: -1000, max: 1000 });
const length = fc.integer({ min: 0, max: 1000 });
const rect = fc.record({ x: coord, y: coord, width: length, height: length });

describe('contains — property-based', () => {
  it('a rectangle contains its intersection with any other', () => {
    fc.assert(fc.property(rect, rect, (a, b) => {
      const i = intersection(a, b);
      if (i) expect(contains(a, i)).toBe(true);
    }));
  });

  it('a non-empty rectangle contains its top-left corner, never its bottom-right one', () => {
    fc.assert(fc.property(rect.filter((r) => r.width > 0 && r.height > 0), (r) => {
      expect(contains(r, { x: r.x, y: r.y })).toBe(true);
      expect(contains(r, { x: r.x + r.width, y: r.y + r.height })).toBe(false);
    }));
  });
});
