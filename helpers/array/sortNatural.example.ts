/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { createSortByNaturalFn, sortStringNaturalAscFn } from './sortNatural';

const examples: HelperExamples = {
  helper: 'sortStringNaturalAscFn',
  category: 'array',
  examples: [
    {
      title: 'Natural sort for strings with embedded numbers',
      description: 'sortStringNaturalAscFn treats numeric parts as numbers: "W2" < "W11" < "W20".',
      code: `['W20', 'W2', 'W11', 'W01'].sort(sortStringNaturalAscFn)
// => ['W01', 'W2', 'W11', 'W20']`,
      assert: () => {
        const result = ['W20', 'W2', 'W11', 'W01'].sort(sortStringNaturalAscFn);
        if (result.join(',') !== 'W01,W2,W11,W20') throw new Error('Unexpected order');
      },
    },
    {
      title: 'Natural sort for object arrays',
      description: 'createSortByNaturalFn sorts objects with embedded numbers in property values.',
      code: `const items = [{ code: 'W20' }, { code: 'W2' }, { code: 'W11' }, { code: 'W01' }];
items.sort(createSortByNaturalFn('code'))
// => W01, W2, W11, W20`,
      assert: () => {
        const items = [{ code: 'W20' }, { code: 'W2' }, { code: 'W11' }, { code: 'W01' }];
        items.sort(createSortByNaturalFn('code'));
        if (items[0].code !== 'W01') throw new Error('Unexpected order');
      },
    },
  ],
};

export default examples;
