/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { hexToRgb } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('hexToRgb', async ({ bench }) => {
  await bench.compare(
    bench('short hex (#rgb)', () => {
      consume(hexToRgb('#f00'));
    }),
    bench('long hex (#rrggbb)', () => {
      consume(hexToRgb('#ff0000'));
    }),
    bench('long hex with alpha (#rrggbbaa)', () => {
      consume(hexToRgb('#ff000080'));
    }),
    RUN,
  );
});
