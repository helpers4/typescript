/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { families } from '@helpers4/license';
import { RUN, consume } from '../../scripts/bench';

test('families', async ({ bench }) => {
  await bench.compare(
    bench('single known token', () => {
      consume(families('GPL-3.0-or-later'));
    }),
    bench('compound expression', () => {
      consume(families('GPL-2.0+ and LGPL-2.0+ and GFDL-1.3'));
    }),
    bench('unknown token', () => {
      consume(families('custom:Acme End User License Agreement'));
    }),
    RUN,
  );
});
