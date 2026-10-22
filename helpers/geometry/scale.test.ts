/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { scale } from './scale';

describe('scale', () => {
  it('uses sx for both axes by default', () => {
    expect(scale(2)).toEqual({ a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 });
  });

  it('accepts a separate vertical factor', () => {
    expect(scale(2, -1)).toEqual({ a: 2, b: 0, c: 0, d: -1, e: 0, f: 0 });
  });
});
