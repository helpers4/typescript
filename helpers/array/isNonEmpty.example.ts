/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isNonEmpty } from './isNonEmpty';

const examples: HelperExamples = {
  helper: 'isNonEmpty',
  category: 'array',
  examples: [
    {
      title: 'Check if an array has elements',
      description: 'Returns true for arrays with at least one element, regardless of the element values.',
      code: `isNonEmpty([1, 2, 3]) // => true
isNonEmpty([null])    // => true  (null is still an element)
isNonEmpty([])        // => false`,
      assert: () => {
        if (!isNonEmpty([1, 2, 3])) throw new Error('[1,2,3] should be non-empty');
        if (!isNonEmpty([null])) throw new Error('[null] should be non-empty');
        if (isNonEmpty([])) throw new Error('[] should not be non-empty');
      },
    },
    {
      title: 'Safe first-element access with type narrowing',
      description: 'In the true branch, the type narrows to [T, ...T[]], making arr[0] always defined.',
      code: `function first<T>(arr: readonly T[]): T | undefined {
  if (isNonEmpty(arr)) return arr[0]; // arr[0] is T, not T | undefined
  return undefined;
}
first([1, 2]) // => 1
first([])     // => undefined`,
      assert: () => {
        function first<T>(arr: readonly T[]): T | undefined {
          if (isNonEmpty(arr)) return arr[0];
          return undefined;
        }
        if (first([1, 2]) !== 1) throw new Error('Expected 1');
        if (first([]) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
