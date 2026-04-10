/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equals } from './equals';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'equals',
  category: 'array',
  examples: [
    {
      title: 'Compare identical arrays',
      description: 'Returns true when both arrays contain the same elements, regardless of order.',
      code: `equals([1, 2, 3], [3, 2, 1])
// => true`,
      assert: () => {
        if (!equals([1, 2, 3], [3, 2, 1])) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect different arrays',
      description: 'Returns false when arrays contain different elements.',
      code: `equals([1, 2], [1, 3])
// => false`,
      assert: () => {
        if (equals([1, 2], [1, 3])) throw new Error('Expected false');
      },
    },
    {
      title: 'Compare arrays of objects',
      description: 'Supports deep comparison of nested objects.',
      code: `equals([{ a: 1 }], [{ a: 1 }])
// => true`,
      assert: () => {
        if (!equals([{ a: 1 }], [{ a: 1 }])) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
