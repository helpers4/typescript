/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createSemaphore } from './createSemaphore';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createSemaphore',
  category: 'promise',
  examples: [
    {
      title: 'Limit concurrent calls to an external API',
      description: 'At most `permits` calls run at once; the rest queue and wait their turn.',
      code: `const semaphore = createSemaphore(2);
const results = await Promise.all(
  urls.map((url) => semaphore.run(() => fetch(url)))
);
// at most 2 fetch() calls in flight at any time`,
      assert: async () => {
        const semaphore = createSemaphore(2);
        let concurrent = 0;
        let max = 0;
        const task = async () => {
          concurrent++;
          max = Math.max(max, concurrent);
          await new Promise((r) => setTimeout(r, 5));
          concurrent--;
        };
        await Promise.all([1, 2, 3, 4].map(() => semaphore.run(task)));
        if (max > 2) throw new Error(`Expected at most 2 concurrent, got ${max}`);
      },
    },
    {
      title: 'run() releases the permit even on error',
      description: 'Prefer run() over manual acquire()/release() — it cannot leak a permit.',
      code: `const semaphore = createSemaphore(1);
await semaphore.run(() => {
  throw new Error('oops');
}).catch(() => {});
semaphore.availablePermits() // => 1, the permit was released`,
      assert: async () => {
        const semaphore = createSemaphore(1);
        await semaphore
          .run(() => {
            throw new Error('oops');
          })
          .catch(() => {});
        if (semaphore.availablePermits() !== 1) throw new Error('Expected permit to be released');
      },
    },
    {
      title: 'Manual acquire() returns a one-shot release function',
      description: 'Calling the same release function twice throws — always caught, even under contention.',
      code: `const semaphore = createSemaphore(1);
const release = await semaphore.acquire();
release();
release(); // throws RangeError: this permit was already released`,
      assert: async () => {
        const semaphore = createSemaphore(1);
        const release = await semaphore.acquire();
        release();
        try {
          release();
          throw new Error('Expected release() to throw on second call');
        } catch (e) {
          if (!(e instanceof RangeError)) throw e;
        }
      },
    },
  ],
};

export default examples;
