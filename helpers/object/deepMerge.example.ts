/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { deepMerge } from './deepMerge';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'deepMerge',
  category: 'object',
  examples: [
    {
      title: 'Merge two objects deeply',
      description: 'Recursively merges source properties into the target object.',
      code: `deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
// => { a: 1, b: { c: 2, d: 3 }, e: 4 }`,
      assert: () => {
        const result = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
        if (result.a !== 1 || (result.b as Record<string, number>).c !== 2 || (result.b as Record<string, number>).d !== 3)
          throw new Error('Unexpected merge result');
      },
    },
  ],
};

export default examples;
