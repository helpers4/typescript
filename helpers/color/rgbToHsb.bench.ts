/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { rgbToHsb } from './rgbToHsb';

describe('rgbToHsb', () => {
  bench('opaque', () => {
    rgbToHsb({ r: 255, g: 128, b: 0 });
  });
  bench('with alpha', () => {
    rgbToHsb({ r: 0, g: 128, b: 255, a: 0.5 });
  });
});
