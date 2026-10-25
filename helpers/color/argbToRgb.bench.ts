/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { argbToRgb } from '@helpers4/color';
import { RUN, consume } from '../../scripts/bench';

test('argbToRgb', async ({ bench }) => {
  await bench.compare(
    bench('opaque red', () => {
      consume(argbToRgb(0xffff0000));
    }),
    bench('semi-transparent green', () => {
      consume(argbToRgb(0x8000ff00));
    }),
    RUN,
  );
});
