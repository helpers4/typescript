/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { applyToRect } from './applyToRect';
import { fit } from './fit';
import type { FitMode } from './fit';

const length = fc.integer({ min: 1, max: 2000 });
const size = fc.record({ width: length, height: length });
const mode = fc.constantFrom<FitMode>('contain', 'cover', 'fill', 'none', 'scale-down');

describe('fit — property-based', () => {
  it('contain and scale-down stay inside the box, cover and fill cover it', () => {
    fc.assert(fc.property(size, size, mode, (content, box, m) => {
      const placed = applyToRect(fit(content, box, { mode: m }), { x: 0, y: 0, ...content });
      const eps = 1e-6;
      if (m === 'contain' || m === 'scale-down') {
        expect(placed.x).toBeGreaterThanOrEqual(-eps);
        expect(placed.y).toBeGreaterThanOrEqual(-eps);
        expect(placed.x + placed.width).toBeLessThanOrEqual(box.width + eps);
        expect(placed.y + placed.height).toBeLessThanOrEqual(box.height + eps);
      }
      if (m === 'cover' || m === 'fill') {
        expect(placed.x).toBeLessThanOrEqual(eps);
        expect(placed.y).toBeLessThanOrEqual(eps);
        expect(placed.x + placed.width).toBeGreaterThanOrEqual(box.width - eps);
        expect(placed.y + placed.height).toBeGreaterThanOrEqual(box.height - eps);
      }
    }));
  });

  it('centered content has equal margins on each side', () => {
    fc.assert(fc.property(size, size, mode, (content, box, m) => {
      const placed = applyToRect(fit(content, box, { mode: m }), { x: 0, y: 0, ...content });
      expect(placed.x).toBeCloseTo(box.width - (placed.x + placed.width), 6);
      expect(placed.y).toBeCloseTo(box.height - (placed.y + placed.height), 6);
    }));
  });
});
