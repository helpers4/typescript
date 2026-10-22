/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mergeDeep } from './mergeDeep';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mergeDeep',
  category: 'object',
  examples: [
    {
      title: 'Merge two objects deeply',
      description: 'Returns a new object — neither input is mutated.',
      code: `mergeDeep({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
// => { a: 1, b: { c: 2, d: 3 }, e: 4 }`,
      assert: () => {
        const base = { a: 1, b: { c: 2 } };
        const result = mergeDeep(base, { b: { d: 3 }, e: 4 });
        if (result.a !== 1 || (result.b as Record<string, number>).c !== 2 || (result.b as Record<string, number>).d !== 3)
          throw new Error('Unexpected merge result');
        if ((base.b as Record<string, number>).d !== undefined)
          throw new Error('Base was mutated');
      },
    },
  ],
};

export default examples;
