/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fitContain } from './fitContain';

describe('fitContain', () => {
  it('letterboxes wide content', () => {
    expect(fitContain({ width: 200, height: 100 }, { width: 100, height: 100 })).toEqual({ scale: 0.5, x: 0, y: 25 });
  });

  it('pillarboxes tall content and scales up small content', () => {
    expect(fitContain({ width: 10, height: 20 }, { width: 100, height: 100 })).toEqual({ scale: 5, x: 25, y: 0 });
  });
});
