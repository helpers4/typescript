/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fit } from './fit';
import { fitContain } from './fitContain';

const wide = { width: 200, height: 100 };
const square = { width: 100, height: 100 };

describe('fitContain', () => {
  it("is fit with mode 'contain'", () => {
    expect(fitContain(wide, square)).toEqual({ a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 25 });
  });

  it('passes the alignment', () => {
    expect(fitContain(wide, square, { x: 1, y: 0 })).toEqual(fit(wide, square, { mode: 'contain', align: { x: 1, y: 0 } }));
  });
});
