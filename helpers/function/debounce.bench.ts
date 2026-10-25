/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { debounce } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const noop = (): void => {};
const debounced = debounce(noop, 1_000);

test('debounce', async ({ bench }) => {
  await bench.compare(
    bench('create a debounced wrapper', () => {
      consume(debounce(noop, 1_000));
    }),
    bench('call a pre-built debounced wrapper (resets the timer)', () => {
      debounced();
    }),
    RUN,
  );
});
