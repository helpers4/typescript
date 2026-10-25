/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrastRatio';

const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 10);
  });

  it('is 1 for identical colors', () => {
    expect(contrastRatio({ r: 12, g: 99, b: 200 }, { r: 12, g: 99, b: 200 })).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio(black, white)).toBe(contrastRatio(white, black));
  });

  it('matches the known WCAG value of #767676 on white (4.54, passes AA)', () => {
    const ratio = contrastRatio({ r: 0x76, g: 0x76, b: 0x76 }, white);
    expect(ratio).toBeCloseTo(4.54, 2);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('matches the known WCAG value of #777777 on white (4.48, fails AA)', () => {
    const ratio = contrastRatio({ r: 0x77, g: 0x77, b: 0x77 }, white);
    expect(ratio).toBeCloseTo(4.48, 2);
    expect(ratio).toBeLessThan(4.5);
  });

  it('matches hand-computed values for colored pairs', () => {
    expect(contrastRatio({ r: 255, g: 0, b: 0 }, black)).toBeCloseTo(5.252, 6);
    expect(contrastRatio({ r: 255, g: 255, b: 0 }, { r: 0, g: 0, b: 255 })).toBeCloseTo(8.0016366, 6);
  });

  it('ignores alpha', () => {
    expect(contrastRatio({ ...black, a: 0.2 }, white)).toBe(contrastRatio(black, white));
  });
});
