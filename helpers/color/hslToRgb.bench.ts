/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { hslToRgb } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('hslToRgb', async ({ bench }) => {
  await bench.compare(
    bench('red', () => {
      consume(hslToRgb({ h: 0, s: 100, l: 50 }));
    }),
    bench('with alpha', () => {
      consume(hslToRgb({ h: 210, s: 50, l: 40, a: 0.5 }));
    }),
    bench('negative hue (wraps)', () => {
      consume(hslToRgb({ h: -30, s: 80, l: 60 }));
    }),
    RUN,
  );
});
