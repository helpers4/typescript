/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { contrastRatio } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('contrastRatio', async ({ bench }) => {
  await bench.compare(
    bench('dark on light', () => {
      consume(contrastRatio({ r: 20, g: 20, b: 30 }, { r: 250, g: 250, b: 245 }));
    }),
    bench('light on dark (swapped)', () => {
      consume(contrastRatio({ r: 250, g: 250, b: 245 }, { r: 20, g: 20, b: 30 }));
    }),
    RUN,
  );
});
