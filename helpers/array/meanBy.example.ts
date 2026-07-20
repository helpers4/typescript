/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { meanBy } from './meanBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'meanBy',
  category: 'array',
  examples: [
    {
      title: 'Average a property across objects',
      description: 'Averages a derived numeric value instead of the items themselves.',
      code: `meanBy([{ price: 10 }, { price: 20 }], item => item.price)
// => 15`,
      assert: () => {
        if (meanBy([{ price: 10 }, { price: 20 }], (item) => item.price) !== 15) throw new Error('Expected 15');
      },
    },
    {
      title: 'Use a property path instead of a function',
      description: 'A string (or key array) path is shorthand for a getter function.',
      code: `meanBy([{ price: 10 }, { price: 20 }], 'price')
// => 15`,
      assert: () => {
        if (meanBy([{ price: 10 }, { price: 20 }], 'price') !== 15) throw new Error('Expected 15');
      },
    },
  ],
};

export default examples;
