/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { cssEasing } from './cssEasing';

describe('cssEasing', () => {
  it('linear is the identity, clamped', () => {
    const linear = cssEasing('linear');
    expect(linear(0.3)).toBe(0.3);
    expect(linear(-1)).toBe(0);
    expect(linear(2)).toBe(1);
  });

  it('maps each keyword to its CSS curve', () => {
    expect(cssEasing('ease')(0.5)).toBeCloseTo(0.8024, 4);
    expect(cssEasing('ease-in')(0.5)).toBeCloseTo(0.3154, 4);
    expect(cssEasing('ease-out')(0.5)).toBeCloseTo(0.6846, 4);
    expect(cssEasing('ease-in-out')(0.5)).toBeCloseTo(0.5, 6);
  });
});
