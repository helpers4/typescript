/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createMutex } from './createMutex';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createMutex',
  category: 'promise',
  examples: [
    {
      title: 'Deduplicate concurrent token refreshes',
      description: 'Only one caller actually refreshes; the rest wait and reuse its result.',
      code: `const mutex = createMutex();
let cached: string | undefined;

async function getToken() {
  return mutex.run(async () => {
    if (cached) return cached;
    cached = await refreshToken(); // only ever runs once per cache miss
    return cached;
  });
}

await Promise.all([getToken(), getToken(), getToken()]);
// refreshToken() was called exactly once`,
      assert: async () => {
        const mutex = createMutex();
        let cached: string | undefined;
        let refreshCount = 0;
        const refreshToken = async () => {
          refreshCount++;
          await new Promise((r) => setTimeout(r, 5));
          return 'token';
        };
        const getToken = () =>
          mutex.run(async () => {
            if (cached) return cached;
            cached = await refreshToken();
            return cached;
          });
        await Promise.all([getToken(), getToken(), getToken()]);
        if (refreshCount !== 1) throw new Error(`Expected 1 refresh, got ${refreshCount}`);
      },
    },
    {
      title: 'isLocked() reports whether the lock is currently held',
      description: 'Useful for diagnostics or conditionally skipping work while locked.',
      code: `const mutex = createMutex();
mutex.isLocked() // => false
const release = await mutex.acquire();
mutex.isLocked() // => true
release();
mutex.isLocked() // => false`,
      assert: async () => {
        const mutex = createMutex();
        if (mutex.isLocked()) throw new Error('Expected unlocked');
        const release = await mutex.acquire();
        if (!mutex.isLocked()) throw new Error('Expected locked');
        release();
        if (mutex.isLocked()) throw new Error('Expected unlocked');
      },
    },
  ],
};

export default examples;
