/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { minBy } from './minBy';

const examples: HelperExamples = {
  helper: 'minBy',
  category: 'array',
  examples: [
    {
      title: 'Pick the item with the smallest derived value',
      description: 'Unlike min(), minBy() returns the whole item, chosen by a key derived from it.',
      code: `minBy(
  [{ name: 'a', size: 3 }, { name: 'b', size: 9 }, { name: 'c', size: 1 }],
  (item) => item.size,
)
// => { name: 'c', size: 1 }`,
      assert: () => {
        const result = minBy([{ name: 'a', size: 3 }, { name: 'b', size: 9 }, { name: 'c', size: 1 }], (item) => item.size);
        if (result?.name !== 'c') throw new Error(`Expected 'c', got ${result?.name}`);
      },
    },
    {
      title: 'Empty array returns undefined',
      description: 'There is no minimum to return for an empty array.',
      code: `minBy([], (item: { size: number }) => item.size)
// => undefined`,
      assert: () => {
        const result = minBy([], (item: { size: number }) => item.size);
        if (result !== undefined) throw new Error(`Expected undefined, got ${result}`);
      },
    },
  ],
};

export default examples;
