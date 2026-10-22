/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unary } from './unary';

const examples: HelperExamples = {
  helper: 'unary',
  category: 'function',
  examples: [
    {
      title: 'Fix the classic .map(parseInt) bug',
      description: 'Array.prototype.map passes (value, index, array) — parseInt reads index as its radix argument.',
      code: `['1', '2', '3'].map(parseInt)
// => [1, NaN, NaN]  (bug: index used as radix)

['1', '2', '3'].map(unary(parseInt))
// => [1, 2, 3]`,
      assert: () => {
        const buggy = ['1', '2', '3'].map(parseInt);
        const fixed = ['1', '2', '3'].map(unary(parseInt));
        if (!Number.isNaN(buggy[1])) throw new Error('Expected the classic bug to reproduce');
        if (JSON.stringify(fixed) !== JSON.stringify([1, 2, 3])) throw new Error('Expected unary() to fix it');
      },
    },
    {
      title: 'Restrict any multi-argument function to one argument',
      description: 'Useful whenever a callback slot passes more arguments than the function should see.',
      code: `const double = unary((n: number, factor?: number) => n * (factor ?? 2));
double(21)
// => 42`,
      assert: () => {
        const double = unary((n: number, factor?: number) => n * (factor ?? 2));
        if (double(21) !== 42) throw new Error('Expected 42');
      },
    },
  ],
};

export default examples;
