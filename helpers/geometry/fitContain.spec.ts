/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fitContain } from './fitContain';

const positive = fc.double({ min: 1, max: 1e4, noNaN: true });
const positiveSize = fc.record({ width: positive, height: positive });

describe('fitContain — property-based', () => {
  it('fits inside the box, touching it on at least one axis, centered', () => {
    fc.assert(fc.property(positiveSize, positiveSize, (content, box) => {
      const { scale, x, y } = fitContain(content, box);
      expect(content.width * scale).toBeLessThanOrEqual(box.width * (1 + 1e-9));
      expect(content.height * scale).toBeLessThanOrEqual(box.height * (1 + 1e-9));
      expect(x).toBeGreaterThanOrEqual(-1e-6);
      expect(y).toBeGreaterThanOrEqual(-1e-6);
      expect(Math.min(x, y)).toBeCloseTo(0, 6);
    }));
  });
});
