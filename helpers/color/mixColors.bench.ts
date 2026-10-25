/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { mixColors } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('mixColors', async ({ bench }) => {
  await bench.compare(
    bench('opaque colors', () => {
      consume(mixColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 30));
    }),
    bench('translucent colors', () => {
      consume(mixColors({ r: 255, g: 0, b: 0, a: 0.5 }, { r: 0, g: 0, b: 255, a: 0.8 }, 30));
    }),
    RUN,
  );
});
