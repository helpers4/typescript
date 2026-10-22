/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { spring } from './spring';

describe('spring', () => {
  it('starts at 0 and is exactly 1 once settled', () => {
    const s = spring();
    expect(s.at(0)).toBe(0);
    expect(s.at(-5)).toBe(0);
    expect(s.at(s.durationMs)).toBe(1);
    expect(s.at(s.durationMs * 10)).toBe(1);
  });

  it('overshoots when under-damped', () => {
    const s = spring({ damping: 5 });
    const peak = Math.max(...Array.from({ length: 200 }, (_, i) => s.at(i * 5)));
    expect(peak).toBeGreaterThan(1.1);
  });

  it('does not overshoot when critically or over-damped', () => {
    for (const damping of [20, 40]) {
      const s = spring({ damping }); // 20 is critical for mass 1 and stiffness 100
      for (let t = 0; t <= s.durationMs; t += 5) expect(s.at(t)).toBeLessThanOrEqual(1);
    }
  });

  it('is still moving just before durationMs', () => {
    for (const options of [{}, { damping: 20 }, { damping: 40 }, { stiffness: 300, damping: 15, initialVelocity: 3 }]) {
      const s = spring(options);
      expect(Math.abs(1 - s.at(s.durationMs - 1))).toBeGreaterThan(0.0009);
    }
  });

  it('is faster with more stiffness', () => {
    expect(spring({ stiffness: 400, damping: 20 }).durationMs).toBeLessThan(spring({ stiffness: 100, damping: 20 }).durationMs);
  });

  it('an initial velocity moves it faster at first', () => {
    expect(spring({ initialVelocity: 10 }).at(20)).toBeGreaterThan(spring().at(20));
  });

  it('a very stiff spring settles within a millisecond', () => {
    expect(spring({ stiffness: 1e12, damping: 1e7 }).durationMs).toBe(1);
  });

  it('easing maps [0, 1] onto the duration', () => {
    const s = spring({ damping: 15 });
    expect(s.easing(0)).toBe(0);
    expect(s.easing(0.25)).toBe(s.at(s.durationMs * 0.25));
    expect(s.easing(1)).toBe(1);
  });

  it('rejects non-positive parameters and a non-finite velocity', () => {
    expect(() => spring({ mass: 0 })).toThrow(RangeError);
    expect(() => spring({ stiffness: -1 })).toThrow(RangeError);
    expect(() => spring({ damping: 0 })).toThrow(RangeError);
    expect(() => spring({ initialVelocity: Number.NaN })).toThrow(RangeError);
    expect(() => spring({ mass: Infinity })).toThrow(RangeError);
  });
});
