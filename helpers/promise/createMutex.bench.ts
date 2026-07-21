/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { createMutex } from './createMutex';

const noop = (): number => 42;

describe('createMutex', () => {
  bench('create a mutex', () => {
    createMutex();
  });

  bench('acquire + release, uncontended', async () => {
    const mutex = createMutex();
    const release = await mutex.acquire();
    release();
  });

  bench('run(), uncontended', async () => {
    const mutex = createMutex();
    await mutex.run(noop);
  });
});
