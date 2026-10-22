/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { some } from './some';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'some',
  category: 'map',
  examples: [
    {
      title: 'Check if any value exceeds a threshold',
      description: 'Returns true as soon as one entry satisfies the predicate.',
      code: `some(new Map([['a', 1], ['b', 2]]), value => value > 1)
// => true`,
      assert: () => {
        if (!some(new Map([['a', 1], ['b', 2]]), (v) => v > 1)) throw new Error('Expected true');
      },
    },
    {
      title: 'Empty map',
      description: 'Always returns false for an empty map.',
      code: `some(new Map(), () => true)
// => false`,
      assert: () => {
        if (some(new Map(), () => true)) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
