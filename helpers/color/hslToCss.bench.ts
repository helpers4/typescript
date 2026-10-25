/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { hslToCss } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('hslToCss', async ({ bench }) => {
  await bench.compare(
    bench('opaque', () => {
      consume(hslToCss({ h: 210, s: 100, l: 50 }));
    }),
    bench('with alpha and a wrapped hue', () => {
      consume(hslToCss({ h: -30, s: 80, l: 40, a: 0.25 }));
    }),
    RUN,
  );
});
