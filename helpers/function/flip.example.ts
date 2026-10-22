/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { flip } from './flip';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'flip',
  category: 'function',
  examples: [
    {
      title: 'Swap argument order',
      description: 'Returns a new function where the first two arguments are swapped.',
      code: `const sub = (a: number, b: number) => a - b;
flip(sub)(3, 10); // => 7  (10 - 3)`,
      assert: () => {
        const sub = (a: number, b: number) => a - b;
        if (flip(sub)(3, 10) !== 7) throw new Error('Expected 7');
      },
    },
    {
      title: 'Adapt a divide function',
      description: 'Useful for adapting binary callbacks in higher-order functions.',
      code: `const divide = (a: number, b: number) => a / b;
const divideInto = flip(divide);
divideInto(2, 100); // => 50`,
      assert: () => {
        const divide = (a: number, b: number) => a / b;
        if (flip(divide)(2, 100) !== 50) throw new Error('Expected 50');
      },
    },
  ],
};

export default examples;
