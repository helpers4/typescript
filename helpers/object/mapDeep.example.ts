/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapDeep } from './mapDeep';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mapDeep',
  category: 'object',
  examples: [
    {
      title: 'Transform every key, recursively',
      description: 'Unlike map(), mapDeep() walks into nested objects and arrays of objects.',
      code: `mapDeep({ a: { b: 1 } }, undefined, key => key.toUpperCase())
// => { A: { B: 1 } }`,
      assert: () => {
        const result = mapDeep({ a: { b: 1 } }, undefined, (key) => key.toUpperCase());
        if (JSON.stringify(result) !== JSON.stringify({ A: { B: 1 } })) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Transform every value, recursively',
      description: 'Values are visited after their own nested content has already been transformed.',
      code: `mapDeep({ a: { b: 1, c: 2 } }, v => typeof v === 'number' ? v * 10 : v)
// => { a: { b: 10, c: 20 } }`,
      assert: () => {
        const result = mapDeep({ a: { b: 1, c: 2 } }, (v) => (typeof v === 'number' ? v * 10 : v));
        if (JSON.stringify(result) !== JSON.stringify({ a: { b: 10, c: 20 } })) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Transform values inside arrays too',
      description: 'Array elements are visited by mapValue as well, keyed by their stringified index.',
      code: `mapDeep({ tags: [1, 2, 3] }, v => typeof v === 'number' ? v * 10 : v)
// => { tags: [10, 20, 30] }`,
      assert: () => {
        const result = mapDeep({ tags: [1, 2, 3] }, (v) => (typeof v === 'number' ? v * 10 : v));
        if (JSON.stringify(result) !== JSON.stringify({ tags: [10, 20, 30] })) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
