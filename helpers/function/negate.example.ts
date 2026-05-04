/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { negate } from './negate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'negate',
  category: 'function',
  examples: [
    {
      title: 'Derive isOdd from isEven',
      description: 'Returns a function that inverts the boolean result of the given predicate.',
      code: `const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);
isOdd(3); // => true
isOdd(4); // => false`,
      assert: () => {
        const isEven = (n: number) => n % 2 === 0;
        const isOdd = negate(isEven);
        if (!isOdd(3)) throw new Error('Expected true for 3');
        if (isOdd(4)) throw new Error('Expected false for 4');
      },
    },
    {
      title: 'Use as a filter predicate',
      description: 'negate is ideal for inverting predicates passed to Array.filter.',
      code: `const isEmpty = (arr: unknown[]) => arr.length === 0;
[[], [1], [], [2, 3]].filter(negate(isEmpty))
// => [[1], [2, 3]]`,
      assert: () => {
        const isEmpty = (arr: unknown[]) => arr.length === 0;
        const result = [[], [1], [], [2, 3]].filter(negate(isEmpty));
        if (result.length !== 2) throw new Error('Expected 2 non-empty arrays');
      },
    },
  ],
};

export default examples;
