/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsUnordered } from './equalsUnordered';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'equalsUnordered',
  category: 'array',
  examples: [
    {
      title: 'Compare identical arrays regardless of order',
      description: 'Returns true when both arrays contain the same elements, in any order.',
      code: `equalsUnordered([1, 2, 3], [3, 2, 1])
// => true`,
      assert: () => {
        if (!equalsUnordered([1, 2, 3], [3, 2, 1])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect different arrays',
      description: 'Returns false when arrays contain different elements.',
      code: `equalsUnordered([1, 2], [1, 3])
// => false`,
      assert: () => {
        if (equalsUnordered([1, 2], [1, 3])) throw new Error('Expected false');
      },
    },
    {
      title: 'Compare arrays of objects',
      description: 'Supports shallow comparison of nested objects.',
      code: `equalsUnordered([{ a: 1 }], [{ a: 1 }])
// => true`,
      assert: () => {
        if (!equalsUnordered([{ a: 1 }], [{ a: 1 }])) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
