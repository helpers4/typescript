/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fit } from './fit';
import { fitNone } from './fitNone';

const wide = { width: 200, height: 100 };
const square = { width: 100, height: 100 };

describe('fitNone', () => {
  it("is fit with mode 'none'", () => {
    expect(fitNone(wide, square)).toEqual({ a: 1, b: 0, c: 0, d: 1, e: -50, f: 0 });
  });

  it('passes the alignment', () => {
    expect(fitNone(wide, square, { x: 1, y: 0 })).toEqual(fit(wide, square, { mode: 'none', align: { x: 1, y: 0 } }));
  });
});
