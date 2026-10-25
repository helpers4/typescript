/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { hsbToRgb } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('hsbToRgb', async ({ bench }) => {
  await bench.compare(
    bench('saturated', () => {
      consume(hsbToRgb({ h: 30, s: 100, b: 100 }));
    }),
    bench('with alpha and a wrapped hue', () => {
      consume(hsbToRgb({ h: -200, s: 40, b: 60, a: 0.5 }));
    }),
    RUN,
  );
});
