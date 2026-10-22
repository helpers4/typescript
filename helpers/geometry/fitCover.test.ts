/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fitCover } from './fitCover';

describe('fitCover', () => {
  it('crops the sides of wide content', () => {
    expect(fitCover({ width: 200, height: 100 }, { width: 100, height: 100 })).toEqual({ scale: 1, x: -50, y: 0 });
  });

  it('crops the top and bottom of tall content', () => {
    expect(fitCover({ width: 10, height: 20 }, { width: 100, height: 100 })).toEqual({ scale: 10, x: 0, y: -50 });
  });
});
