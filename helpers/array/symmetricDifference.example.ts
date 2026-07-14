/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { symmetricDifference } from './symmetricDifference';

const examples: HelperExamples = {
  helper: 'symmetricDifference',
  category: 'array',
  examples: [
    {
      title: 'Find items unique to either array',
      description: 'Complements difference()/intersection() with the "in either, not both" set operation.',
      code: `symmetricDifference([1, 2, 3], [2, 3, 4])
// => [1, 4]`,
      assert: () => {
        const result = symmetricDifference([1, 2, 3], [2, 3, 4]);
        if (JSON.stringify(result) !== JSON.stringify([1, 4])) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Identical arrays have no symmetric difference',
      description: 'Items shared by both arrays are excluded entirely.',
      code: `symmetricDifference(['a', 'b'], ['a', 'b'])
// => []`,
      assert: () => {
        const result = symmetricDifference(['a', 'b'], ['a', 'b']);
        if (result.length !== 0) throw new Error('Expected an empty result');
      },
    },
  ],
};

export default examples;
