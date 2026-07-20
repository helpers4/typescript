/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { countBy } from './countBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'countBy',
  category: 'map',
  examples: [
    {
      title: 'Count entries by parity',
      description: 'Groups values by a derived key and counts how many fall into each group.',
      code: `countBy(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]]), v => v % 2 === 0 ? 'even' : 'odd')
// => Map(2) { 'odd' => 2, 'even' => 2 }`,
      assert: () => {
        const result = countBy(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]]), (v) => (v % 2 === 0 ? 'even' : 'odd'));
        if (result.get('odd') !== 2 || result.get('even') !== 2) throw new Error('Unexpected counts');
      },
    },
  ],
};

export default examples;
