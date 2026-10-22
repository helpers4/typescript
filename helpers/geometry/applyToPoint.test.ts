/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';

describe('applyToPoint', () => {
  it('follows the CSS matrix(a, b, c, d, e, f) layout', () => {
    const m = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
    expect(applyToPoint(m, { x: 1, y: 1 })).toEqual({ x: 1 + 3 + 5, y: 2 + 4 + 6 });
  });
});
