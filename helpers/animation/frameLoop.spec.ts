/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameLoop } from './frameLoop';

describe('frameLoop — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('reports the elapsed time of the injected clock, starting at 0, until stopped', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    await fc.assert(fc.asyncProperty(fc.array(fc.integer({ min: 0, max: 50 }), { minLength: 1, maxLength: 20 }), async (steps) => {
      let time = 1000;
      const seen: number[] = [];
      const loop = frameLoop((elapsed) => {
        seen.push(elapsed);
        return seen.length <= steps.length;
      }, { now: () => time });
      for (const step of steps) {
        time += step;
        vi.advanceTimersByTime(16);
      }
      await loop.finished;
      let expected = 0;
      expect(seen).toEqual([0, ...steps.map((step) => (expected += step))]);
    }));
  });
});
