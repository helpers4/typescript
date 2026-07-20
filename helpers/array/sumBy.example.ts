/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sumBy } from './sumBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sumBy',
  category: 'array',
  examples: [
    {
      title: 'Sum a property across objects',
      description: 'Sums a derived numeric value instead of the items themselves.',
      code: `sumBy([{ price: 10 }, { price: 20 }], item => item.price)
// => 30`,
      assert: () => {
        if (sumBy([{ price: 10 }, { price: 20 }], (item) => item.price) !== 30) throw new Error('Expected 30');
      },
    },
    {
      title: 'Use a property path instead of a function',
      description: 'A string (or key array) path is shorthand for a getter function.',
      code: `sumBy([{ price: 10 }, { price: 20 }], 'price')
// => 30`,
      assert: () => {
        if (sumBy([{ price: 10 }, { price: 20 }], 'price') !== 30) throw new Error('Expected 30');
      },
    },
  ],
};

export default examples;
