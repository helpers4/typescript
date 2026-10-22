/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { createSortByBooleanFn } from './createSortByBooleanFn';

const examples: HelperExamples = {
  helper: 'createSortByBooleanFn',
  category: 'array',
  examples: [
    {
      title: 'Sort objects with true values first',
      description: 'Default items float to the top of the list.',
      code: `const items = [{ isDefault: false }, { isDefault: true }, { isDefault: false }];
items.sort(createSortByBooleanFn('isDefault'))
// => [{ isDefault: true }, { isDefault: false }, { isDefault: false }]`,
      assert: () => {
        const items = [{ isDefault: false }, { isDefault: true }, { isDefault: false }];
        items.sort(createSortByBooleanFn('isDefault'));
        if (!items[0]!.isDefault) throw new Error('Expected the default item first');
      },
    },
    {
      title: 'Sort with false values first',
      description: 'Pass trueFirst = false to invert the priority.',
      code: `const items = [{ archived: true }, { archived: false }];
items.sort(createSortByBooleanFn('archived', false))
// => [{ archived: false }, { archived: true }]`,
      assert: () => {
        const items = [{ archived: true }, { archived: false }];
        items.sort(createSortByBooleanFn('archived', false));
        if (items[0]!.archived) throw new Error('Expected archived: false first');
      },
    },
  ],
};

export default examples;
