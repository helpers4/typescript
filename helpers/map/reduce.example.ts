/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { reduce } from './reduce';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'reduce',
  category: 'map',
  examples: [
    {
      title: 'Sum all values',
      description: 'Reduces a Map of numbers to their total.',
      code: `reduce(new Map([['a', 1], ['b', 2], ['c', 3]]), (acc, value) => acc + value, 0)
// => 6`,
      assert: () => {
        const total = reduce(new Map([['a', 1], ['b', 2], ['c', 3]]), (acc, value) => acc + value, 0);
        if (total !== 6) throw new Error(`Expected 6, got ${total}`);
      },
    },
    {
      title: 'Build an array of keys',
      description: 'Reduce can produce a completely different shape than the map values.',
      code: `reduce(new Map([['a', 1], ['b', 2]]), (acc: string[], _v, key) => [...acc, key], [])
// => ['a', 'b']`,
      assert: () => {
        const keys = reduce(new Map([['a', 1], ['b', 2]]), (acc: string[], _v, key) => [...acc, key], []);
        if (keys.join(',') !== 'a,b') throw new Error('Unexpected keys order');
      },
    },
  ],
};

export default examples;
