/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { pickBy } from './pickBy';

const examples: HelperExamples = {
  helper: 'pickBy',
  category: 'object',
  examples: [
    {
      title: 'Keep only entries matching a predicate',
      description: 'Unlike pick(), the keys to keep don’t need to be known ahead of time.',
      code: `pickBy({ a: 1, b: 0, c: 2 }, (value) => value > 0)
// => { a: 1, c: 2 }`,
      assert: () => {
        const result = pickBy({ a: 1, b: 0, c: 2 }, (value) => value > 0);
        if (JSON.stringify(result) !== JSON.stringify({ a: 1, c: 2 })) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Keep entries by key name',
      description: 'The predicate also receives the key, so filtering by name works too.',
      code: `pickBy({ _id: 1, name: 'x', _internal: true }, (_v, key) => !key.startsWith('_'))
// => { name: 'x' }`,
      assert: () => {
        const result = pickBy({ _id: 1, name: 'x', _internal: true }, (_v, key) => !key.startsWith('_'));
        if (JSON.stringify(result) !== JSON.stringify({ name: 'x' })) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
