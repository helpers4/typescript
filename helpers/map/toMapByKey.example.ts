/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toMapByKey } from './toMapByKey';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'toMapByKey',
  category: 'map',
  examples: [
    {
      title: 'Index an array of records by id',
      description: 'Builds a Map keyed by a derived value, for O(1) lookup by that key.',
      code: `toMapByKey([{ id: 'a', n: 1 }, { id: 'b', n: 2 }], item => item.id)
// => Map(2) { 'a' => {...}, 'b' => {...} }`,
      assert: () => {
        const map = toMapByKey([{ id: 'a', n: 1 }, { id: 'b', n: 2 }], (item) => item.id);
        if (map.get('b')?.n !== 2) throw new Error('Unexpected lookup result');
      },
    },
    {
      title: 'Last item wins on collision',
      description: 'When two items derive the same key, the later one overwrites the earlier one.',
      code: `toMapByKey([{ id: 'a', n: 1 }, { id: 'a', n: 2 }], item => item.id).get('a')
// => { id: 'a', n: 2 }`,
      assert: () => {
        const map = toMapByKey([{ id: 'a', n: 1 }, { id: 'a', n: 2 }], (item) => item.id);
        if (map.get('a')?.n !== 2) throw new Error('Expected the later item to win');
      },
    },
  ],
};

export default examples;
