/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { select } from '@helpers4/array';
import { RUN, consume } from '../../scripts/bench';

const large = Array.from({ length: 10_000 }, (_, i) => i);

test('select', async ({ bench }) => {
  await bench.compare(
    bench('map only (no condition)', () => {
      consume(select(large, x => x * 2));
    }),
    bench('filter + map, half pass', () => {
      consume(select(large, x => x * 2, x => x % 2 === 0));
    }),
    RUN,
  );
});
