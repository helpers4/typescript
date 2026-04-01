/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { arrayEquals } from './arrayEquals';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'arrayEquals',
  category: 'array',
  examples: [
    {
      title: 'Compare identical arrays',
      description: 'Returns true when both arrays contain the same elements, regardless of order.',
      code: `arrayEquals([1, 2, 3], [3, 2, 1])
// => true`,
      assert: () => {
        if (!arrayEquals([1, 2, 3], [3, 2, 1])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect different arrays',
      description: 'Returns false when arrays contain different elements.',
      code: `arrayEquals([1, 2], [1, 3])
// => false`,
      assert: () => {
        if (arrayEquals([1, 2], [1, 3])) throw new Error('Expected false');
      },
    },
    {
      title: 'Compare arrays of objects',
      description: 'Supports deep comparison of nested objects.',
      code: `arrayEquals([{ a: 1 }], [{ a: 1 }])
// => true`,
      assert: () => {
        if (!arrayEquals([{ a: 1 }], [{ a: 1 }])) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
