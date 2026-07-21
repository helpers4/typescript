/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createSemaphore } from './createSemaphore';

const noop = (): number => 42;

describe('createSemaphore', () => {
  bench('create a semaphore', () => {
    createSemaphore(10);
  });

  bench('acquire + release, uncontended', async () => {
    const semaphore = createSemaphore(10);
    const release = await semaphore.acquire();
    release();
  });

  bench('run(), uncontended', async () => {
    const semaphore = createSemaphore(10);
    await semaphore.run(noop);
  });

  bench('run(), 20 concurrent callers over 10 permits', async () => {
    const semaphore = createSemaphore(10);
    await Promise.all(Array.from({ length: 20 }, () => semaphore.run(noop)));
  });
});
