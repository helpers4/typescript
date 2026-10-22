/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { hslToCss } from './hslToCss';

describe('hslToCss', () => {
  bench('opaque', () => {
    hslToCss({ h: 210, s: 100, l: 50 });
  });
  bench('with alpha and a wrapped hue', () => {
    hslToCss({ h: -30, s: 80, l: 40, a: 0.25 });
  });
});
