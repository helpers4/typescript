/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { retry } from './retry';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'retry',
  category: 'promise',
  examples: [
    {
      title: 'Retry a failing function',
      description: 'Retries the function up to maxAttempts times before giving up.',
      code: `let attempt = 0;
await retry(() => {
  attempt++;
  if (attempt < 3) throw new Error('not yet');
  return Promise.resolve('success');
}, 3, 10)
// => 'success' (after 2 failures)`,
      assert: async () => {
        let attempt = 0;
        const result = await retry(() => {
          attempt++;
          if (attempt < 3) throw new Error('not yet');
          return Promise.resolve('success');
        }, 3, 10);
        if (result !== 'success') throw new Error('Expected success');
        if (attempt !== 3) throw new Error(`Expected 3 attempts, got ${attempt}`);
      },
    },
  ],
};

export default examples;
