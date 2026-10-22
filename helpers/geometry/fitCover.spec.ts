/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fitCover } from './fitCover';

const positive = fc.double({ min: 1, max: 1e4, noNaN: true });
const positiveSize = fc.record({ width: positive, height: positive });

describe('fitCover — property-based', () => {
  it('covers the box, matching it on at least one axis, centered', () => {
    fc.assert(fc.property(positiveSize, positiveSize, (content, box) => {
      const { scale, x, y } = fitCover(content, box);
      expect(content.width * scale).toBeGreaterThanOrEqual(box.width * (1 - 1e-9));
      expect(content.height * scale).toBeGreaterThanOrEqual(box.height * (1 - 1e-9));
      expect(x).toBeLessThanOrEqual(1e-6);
      expect(y).toBeLessThanOrEqual(1e-6);
      expect(Math.max(x, y)).toBeCloseTo(0, 6);
    }));
  });
});
