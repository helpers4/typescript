/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { throttle } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const noop = (): void => {};
const throttled = throttle(noop, 1_000);

test('throttle', async ({ bench }) => {
  await bench.compare(
    bench('create a throttled wrapper', () => {
      consume(throttle(noop, 1_000));
    }),
    bench('call a pre-built throttled wrapper (mostly rate-limited path)', () => {
      throttled();
    }),
    RUN,
  );
});
