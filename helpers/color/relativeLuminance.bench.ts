/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { relativeLuminance } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('relativeLuminance', async ({ bench }) => {
  await bench.compare(
    bench('dark (linear segment)', () => {
      consume(relativeLuminance({ r: 5, g: 8, b: 10 }));
    }),
    bench('bright (power segment)', () => {
      consume(relativeLuminance({ r: 200, g: 120, b: 250 }));
    }),
    RUN,
  );
});
