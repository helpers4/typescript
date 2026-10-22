/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { translate } from './translate';

const coord = fc.integer({ min: -1000, max: 1000 });
const point = fc.record({ x: coord, y: coord });

describe('translate — property-based', () => {
  it('adds the offset to any point', () => {
    fc.assert(fc.property(point, coord, coord, (p, tx, ty) => {
      expect(applyToPoint(translate(tx, ty), p)).toEqual({ x: p.x + tx, y: p.y + ty });
    }));
  });
});
