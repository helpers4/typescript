/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { filter } from './filter';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'filter',
  category: 'map',
  examples: [
    {
      title: 'Keep only even values',
      description: 'Creates a new Map with only the entries whose value satisfies the predicate.',
      code: `filter(new Map([['a', 1], ['b', 2], ['c', 3]]), value => value % 2 === 0)
// => Map(1) { 'b' => 2 }`,
      assert: () => {
        const result = filter(new Map([['a', 1], ['b', 2], ['c', 3]]), (v) => v % 2 === 0);
        if (result.size !== 1 || result.get('b') !== 2) throw new Error('Unexpected filter result');
      },
    },
    {
      title: 'No matches',
      description: 'Returns an empty Map when nothing matches.',
      code: `filter(new Map([['a', 1]]), () => false)
// => Map(0) {}`,
      assert: () => {
        const result = filter(new Map([['a', 1]]), () => false);
        if (result.size !== 0) throw new Error('Expected an empty map');
      },
    },
  ],
};

export default examples;
