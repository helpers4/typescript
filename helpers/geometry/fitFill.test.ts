/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fit } from './fit';
import { fitFill } from './fitFill';

const wide = { width: 200, height: 100 };
const square = { width: 100, height: 100 };

describe('fitFill', () => {
  it("is fit with mode 'fill'", () => {
    expect(fitFill(wide, square)).toEqual({ a: 0.5, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it('passes the alignment', () => {
    expect(fitFill(wide, square, { x: 1, y: 0 })).toEqual(fit(wide, square, { mode: 'fill', align: { x: 1, y: 0 } }));
  });
});
