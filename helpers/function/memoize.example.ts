/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { memoize } from './memoize';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'memoize',
  category: 'function',
  examples: [
    {
      title: 'Cache function results',
      description: 'The underlying function is only called once for the same arguments.',
      code: `let calls = 0;
const expensive = memoize((n: number) => { calls++; return n * 2; });
expensive(5); // => 10 (computed)
expensive(5); // => 10 (cached)`,
      assert: () => {
        let calls = 0;
        const fn = memoize((n: number) => { calls++; return n * 2; });
        const r1 = fn(5);
        const r2 = fn(5);
        if (r1 !== 10 || r2 !== 10) throw new Error('Wrong result');
        if (calls !== 1) throw new Error(`Expected 1 call, got ${calls}`);
      },
    },
  ],
};

export default examples;
