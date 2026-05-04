/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { inRange } from './inRange';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'inRange',
  category: 'number',
  examples: [
    {
      title: 'Check if a value is within bounds (inclusive)',
      description: 'Both min and max are included by default.',
      code: `inRange(5, 1, 10)   // => true
inRange(0, 1, 10)   // => false
inRange(1, 1, 10)   // => true  (min included)
inRange(10, 1, 10)  // => true  (max included)`,
      assert: () => {
        if (!inRange(5, 1, 10)) throw new Error('5 should be in [1,10]');
        if (inRange(0, 1, 10)) throw new Error('0 should not be in [1,10]');
        if (!inRange(1, 1, 10)) throw new Error('1 should be in [1,10]');
      },
    },
    {
      title: 'Exclusive range',
      description: 'Use { inclusive: "none" } for open interval (min, max).',
      code: `inRange(5, 1, 10, { inclusive: 'none' })  // => true
inRange(1, 1, 10, { inclusive: 'none' })  // => false
inRange(10, 1, 10, { inclusive: 'none' }) // => false`,
      assert: () => {
        if (!inRange(5, 1, 10, { inclusive: 'none' })) throw new Error('5 in (1,10)');
        if (inRange(1, 1, 10, { inclusive: 'none' })) throw new Error('1 not in (1,10)');
      },
    },
  ],
};

export default examples;
