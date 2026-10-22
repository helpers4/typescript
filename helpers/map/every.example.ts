/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { every } from './every';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'every',
  category: 'map',
  examples: [
    {
      title: 'Check that all values are positive',
      description: 'Returns false as soon as one entry fails the predicate.',
      code: `every(new Map([['a', 1], ['b', 2]]), value => value > 0)
// => true`,
      assert: () => {
        if (!every(new Map([['a', 1], ['b', 2]]), (v) => v > 0)) throw new Error('Expected true');
      },
    },
    {
      title: 'Empty map',
      description: 'Vacuously true for an empty map.',
      code: `every(new Map(), () => false)
// => true`,
      assert: () => {
        if (!every(new Map(), () => false)) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
