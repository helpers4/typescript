/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { findKey } from './findKey';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'findKey',
  category: 'map',
  examples: [
    {
      title: 'Find the key of the first matching entry',
      description: 'Searches in insertion order and returns the key of the first match.',
      code: `findKey(new Map([['a', 1], ['b', 2]]), value => value > 1)
// => 'b'`,
      assert: () => {
        if (findKey(new Map([['a', 1], ['b', 2]]), (v) => v > 1) !== 'b') throw new Error('Expected "b"');
      },
    },
    {
      title: 'No match',
      description: 'Returns undefined when nothing satisfies the predicate.',
      code: `findKey(new Map([['a', 1]]), value => value > 10)
// => undefined`,
      assert: () => {
        if (findKey(new Map([['a', 1]]), (v) => v > 10) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
