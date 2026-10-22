/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isTruthy } from './isTruthy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isTruthy',
  category: 'type',
  examples: [
    {
      title: 'Check truthy values',
      description: 'Returns true for all truthy values, false for falsy ones.',
      code: `isTruthy(1)         // => true
isTruthy('hello')   // => true
isTruthy(0)         // => false
isTruthy(null)      // => false`,
      assert: () => {
        if (!isTruthy(1)) throw new Error('1 should be truthy');
        if (!isTruthy('hello')) throw new Error('"hello" should be truthy');
        if (isTruthy(0)) throw new Error('0 should not be truthy');
        if (isTruthy(null)) throw new Error('null should not be truthy');
      },
    },
    {
      title: 'Type-safe filter alternative to Boolean',
      description: 'Use isTruthy with Array.filter to get correct TypeScript narrowing.',
      code: `const items = ['a', '', null, 'b', undefined];
const result = items.filter(isTruthy);
// => ['a', 'b'] with type string[]`,
      assert: () => {
        const items: (string | null | undefined)[] = ['a', '', null, 'b', undefined];
        const result = items.filter(isTruthy);
        if (result.length !== 2) throw new Error('Expected 2 items');
        if (result[0] !== 'a' || result[1] !== 'b') throw new Error('Wrong items');
      },
    },
  ],
};

export default examples;
