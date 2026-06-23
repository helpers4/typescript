/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isArrayLike } from './isArrayLike';

const examples: HelperExamples = {
  helper: 'isArrayLike',
  category: 'type',
  examples: [
    {
      title: 'Detect array-like values',
      description: 'Arrays, strings, and objects with a non-negative integer length are array-like.',
      code: `isArrayLike([1, 2, 3])       // => true
isArrayLike('hello')         // => true
isArrayLike({ length: 3 })   // => true
isArrayLike({ length: -1 })  // => false
isArrayLike(() => {})        // => false  (functions excluded)
isArrayLike(null)            // => false`,
      assert: () => {
        if (!isArrayLike([1, 2])) throw new Error('array should be array-like');
        if (!isArrayLike('hello')) throw new Error('string should be array-like');
        if (!isArrayLike({ length: 3 })) throw new Error('{length:3} should be array-like');
        if (isArrayLike({ length: -1 })) throw new Error('{length:-1} should not be array-like');
        if (isArrayLike(() => {})) throw new Error('function should not be array-like');
      },
    },
    {
      title: 'Convert an array-like value to an array',
      description: 'Use as a guard before Array.from().',
      code: `function toArray(value: unknown): unknown[] {
  if (isArrayLike(value)) return Array.from(value);
  return [value];
}
toArray([1, 2])       // => [1, 2]
toArray('abc')        // => ['a', 'b', 'c']
toArray(42)           // => [42]`,
      assert: () => {
        function toArray(value: unknown): unknown[] {
          if (isArrayLike(value)) return Array.from(value);
          return [value];
        }
        if (toArray([1, 2]).length !== 2) throw new Error('Expected length 2');
        if (toArray('abc').length !== 3) throw new Error('Expected length 3');
        if (toArray(42).length !== 1) throw new Error('Expected [42]');
      },
    },
  ],
};

export default examples;
