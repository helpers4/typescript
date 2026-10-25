/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { createMutex } from '@helpers4/promise';
import { RUN, consume } from '../../scripts/bench';

const noop = (): number => 42;

test('createMutex', async ({ bench }) => {
  await bench.compare(
    bench('create a mutex', () => {
      consume(createMutex());
    }),
    bench('acquire + release, uncontended', async () => {
      const mutex = createMutex();
      const release = await mutex.acquire();
      release();
    }),
    bench('run(), uncontended', async () => {
      const mutex = createMutex();
      await mutex.run(noop);
    }),
    RUN,
  );
});
