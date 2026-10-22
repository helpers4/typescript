/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tween } from './tween';

describe('tween — property-based', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('starts on from, ends on to, and reports a non-decreasing progress', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    await fc.assert(fc.asyncProperty(fc.integer({ min: 1, max: 500 }), fc.array(fc.integer({ min: 1, max: 50 }), { maxLength: 30 }), async (durationMs, steps) => {
      let time = 0;
      const seen: [number, number][] = [];
      const t = tween({ from: -3, to: 7, durationMs, onUpdate: (v, p) => seen.push([v, p]), now: () => time });
      for (const step of [...steps, durationMs]) {
        time += step;
        vi.advanceTimersByTime(16);
      }
      await t.finished;
      expect(seen[0]).toEqual([-3, 0]);
      expect(seen.at(-1)).toEqual([7, 1]);
      for (let i = 1; i < seen.length; i++) expect(seen[i]![1]).toBeGreaterThanOrEqual(seen[i - 1]![1]);
    }));
  });
});
