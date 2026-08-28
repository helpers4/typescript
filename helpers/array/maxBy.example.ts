/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { maxBy } from './maxBy';

const examples: HelperExamples = {
  helper: 'maxBy',
  category: 'array',
  examples: [
    {
      title: 'Pick the item with the greatest derived value',
      description: 'Unlike max(), maxBy() returns the whole item, chosen by a key derived from it.',
      code: `maxBy(
  [{ name: 'a', size: 3 }, { name: 'b', size: 9 }, { name: 'c', size: 1 }],
  (item) => item.size,
)
// => { name: 'b', size: 9 }`,
      assert: () => {
        const result = maxBy([{ name: 'a', size: 3 }, { name: 'b', size: 9 }, { name: 'c', size: 1 }], (item) => item.size);
        if (result?.name !== 'b') throw new Error(`Expected 'b', got ${result?.name}`);
      },
    },
    {
      title: 'Empty array returns undefined',
      description: 'There is no maximum to return for an empty array.',
      code: `maxBy([], (item: { size: number }) => item.size)
// => undefined`,
      assert: () => {
        const result = maxBy([], (item: { size: number }) => item.size);
        if (result !== undefined) throw new Error(`Expected undefined, got ${result}`);
      },
    },
  ],
};

export default examples;
