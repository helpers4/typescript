/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fit } from './fit';
import { fitScaleDown } from './fitScaleDown';

const length = fc.integer({ min: 1, max: 2000 });
const size = fc.record({ width: length, height: length });
const position = fc.double({ min: 0, max: 1, noNaN: true });

describe('fitScaleDown — property-based', () => {
  it("always equals fit with mode 'scale-down'", () => {
    fc.assert(fc.property(size, size, position, position, (content, box, x, y) => {
      expect(fitScaleDown(content, box, { x, y })).toEqual(fit(content, box, { mode: 'scale-down', align: { x, y } }));
    }));
  });
});
