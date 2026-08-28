/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { uniqueBy } from './uniqueBy';

const examples: HelperExamples = {
  helper: 'uniqueBy',
  category: 'array',
  examples: [
    {
      title: 'Deduplicate by a derived key, keeping the first occurrence',
      description: 'Two different objects are considered duplicates when keyFn derives the same key for both.',
      code: `uniqueBy(
  [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }],
  (item) => item.id,
)
// => [{ id: 1, v: 'a' }, { id: 2, v: 'b' }]`,
      assert: () => {
        const result = uniqueBy([{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], (item) => item.id);
        if (result.length !== 2 || result[0]!.v !== 'a') throw new Error(`Unexpected: ${JSON.stringify(result)}`);
      },
    },
    {
      title: 'Keep the last occurrence instead',
      description: 'Pass { keep: "last" } to keep the last item seen for each key, instead of the first.',
      code: `uniqueBy(
  [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }],
  (item) => item.id,
  { keep: 'last' },
)
// => [{ id: 1, v: 'c' }, { id: 2, v: 'b' }]`,
      assert: () => {
        const result = uniqueBy([{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }], (item) => item.id, { keep: 'last' });
        if (result.length !== 2 || result[0]!.v !== 'c') throw new Error(`Unexpected: ${JSON.stringify(result)}`);
      },
    },
  ],
};

export default examples;
