/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { fit } from './fit';
import { fitFill } from './fitFill';

const length = fc.integer({ min: 1, max: 2000 });
const size = fc.record({ width: length, height: length });
const position = fc.double({ min: 0, max: 1, noNaN: true });

describe('fitFill — property-based', () => {
  it("always equals fit with mode 'fill'", () => {
    fc.assert(fc.property(size, size, position, position, (content, box, x, y) => {
      expect(fitFill(content, box, { x, y })).toEqual(fit(content, box, { mode: 'fill', align: { x, y } }));
    }));
  });
});
