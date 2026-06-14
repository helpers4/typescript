/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isEmpty } from './isEmpty';

const examples: HelperExamples = {
  helper: 'isEmpty',
  category: 'array',
  examples: [
    {
      title: 'Check if an array is empty',
      description: 'Returns true only for arrays with no elements.',
      code: `isEmpty([])        // => true
isEmpty([1, 2, 3]) // => false
isEmpty([null])    // => false  (null is still an element)`,
      assert: () => {
        if (!isEmpty([])) throw new Error('[] should be empty');
        if (isEmpty([1, 2, 3])) throw new Error('[1,2,3] should not be empty');
        if (isEmpty([null])) throw new Error('[null] should not be empty');
      },
    },
    {
      title: 'Branch on empty array with type narrowing',
      description: 'In the true branch, the type narrows to never[], ensuring no element access.',
      code: `function first<T>(arr: T[]): T | undefined {
  if (isEmpty(arr)) return undefined;
  return arr[0]; // TypeScript knows arr is non-empty here
}
first([])      // => undefined
first([1, 2])  // => 1`,
      assert: () => {
        function first<T>(arr: T[]): T | undefined {
          if (isEmpty(arr)) return undefined;
          return arr[0];
        }
        if (first([]) !== undefined) throw new Error('Expected undefined');
        if (first([1, 2]) !== 1) throw new Error('Expected 1');
      },
    },
  ],
};

export default examples;
