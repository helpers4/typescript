/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { hsbToRgb } from './hsbToRgb';

describe('hsbToRgb', () => {
  bench('saturated', () => {
    hsbToRgb({ h: 30, s: 100, b: 100 });
  });
  bench('with alpha and a wrapped hue', () => {
    hsbToRgb({ h: -200, s: 40, b: 60, a: 0.5 });
  });
});
