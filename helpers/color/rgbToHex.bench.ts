/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { rgbToHex } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('rgbToHex', async ({ bench }) => {
  await bench.compare(
    bench('opaque color', () => {
      consume(rgbToHex({ r: 255, g: 0, b: 0 }));
    }),
    bench('with alpha', () => {
      consume(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }));
    }),
    bench('out-of-range channels (clamped)', () => {
      consume(rgbToHex({ r: 300, g: -10, b: 128.7 }));
    }),
    RUN,
  );
});
