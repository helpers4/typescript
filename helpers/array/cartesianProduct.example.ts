/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cartesianProduct } from './cartesianProduct';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'cartesianProduct',
  category: 'array',
  examples: [
    {
      title: 'Combine two arrays',
      description: 'Returns all ordered pairs from two arrays.',
      code: `cartesianProduct([1, 2], ['a', 'b'])
// => [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]`,
      assert: () => {
        const result = cartesianProduct([1, 2], ['a', 'b']);
        if (result.length !== 4) throw new Error(`Expected 4 pairs, got ${result.length}`);
      },
    },
    {
      title: 'Generate product combinations',
      description: 'Useful for generating all size/color variant combinations.',
      code: `cartesianProduct(['S', 'M', 'L'], ['red', 'blue'])
// => [['S','red'],['S','blue'],['M','red'],['M','blue'],['L','red'],['L','blue']]`,
      assert: () => {
        const result = cartesianProduct(['S', 'M', 'L'], ['red', 'blue']);
        if (result.length !== 6) throw new Error(`Expected 6, got ${result.length}`);
      },
    },
    {
      title: 'Empty input returns empty array',
      description: 'If any input array is empty, the result is an empty array.',
      code: `cartesianProduct([1, 2], []) // => []`,
      assert: () => {
        const result = cartesianProduct([1, 2], []);
        if (result.length !== 0) throw new Error('Expected empty array');
      },
    },
  ],
};

export default examples;
