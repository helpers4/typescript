/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { rgbToHsl } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('rgbToHsl', async ({ bench }) => {
  await bench.compare(
    bench('red', () => {
      consume(rgbToHsl({ r: 255, g: 0, b: 0 }));
    }),
    bench('with alpha', () => {
      consume(rgbToHsl({ r: 0, g: 128, b: 255, a: 0.5 }));
    }),
    bench('grayscale (r === g === b)', () => {
      consume(rgbToHsl({ r: 128, g: 128, b: 128 }));
    }),
    RUN,
  );
});
