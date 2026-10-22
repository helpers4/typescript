/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { TimeoutError, timeout } from './timeout';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'timeout',
  category: 'promise',
  examples: [
    {
      title: 'Reject a slow promise',
      description: 'Throws a TimeoutError if the promise does not resolve in time.',
      code: `await timeout(fetch('/api/data'), 5000)
// Rejects with TimeoutError if fetch takes longer than 5s`,
      assert: async () => {
        const slow = new Promise<string>(r => setTimeout(() => r('done'), 200));
        try {
          await timeout(slow, 10);
          throw new Error('Should have timed out');
        } catch (e) {
          if (!(e instanceof TimeoutError)) throw new Error('Expected TimeoutError');
        }
      },
    },
    {
      title: 'Resolve fast promise normally',
      description: 'Returns the value if the promise resolves before the timeout.',
      code: `const result = await timeout(Promise.resolve('fast'), 1000)
// => 'fast'`,
      assert: async () => {
        const result = await timeout(Promise.resolve('fast'), 1000);
        if (result !== 'fast') throw new Error(`Expected 'fast', got ${result}`);
      },
    },
  ],
};

export default examples;
