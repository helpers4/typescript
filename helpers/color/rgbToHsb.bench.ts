/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { rgbToHsb } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('rgbToHsb', async ({ bench }) => {
  await bench.compare(
    bench('opaque', () => {
      consume(rgbToHsb({ r: 255, g: 128, b: 0 }));
    }),
    bench('with alpha', () => {
      consume(rgbToHsb({ r: 0, g: 128, b: 255, a: 0.5 }));
    }),
    RUN,
  );
});
