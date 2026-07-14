/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { omitBy } from './omitBy';

const examples: HelperExamples = {
  helper: 'omitBy',
  category: 'object',
  examples: [
    {
      title: 'Drop entries matching a predicate',
      description: 'Unlike omit(), the keys to drop don’t need to be known ahead of time.',
      code: `omitBy({ a: 1, b: undefined, c: 2 }, (value) => value === undefined)
// => { a: 1, c: 2 }`,
      assert: () => {
        const result = omitBy({ a: 1, b: undefined, c: 2 }, (value) => value === undefined);
        if (JSON.stringify(result) !== JSON.stringify({ a: 1, c: 2 })) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Drop entries by key name',
      description: 'The predicate also receives the key, so filtering by name works too.',
      code: `omitBy({ id: 1, name: 'x', _internal: true }, (_v, key) => key.startsWith('_'))
// => { id: 1, name: 'x' }`,
      assert: () => {
        const result = omitBy({ id: 1, name: 'x', _internal: true }, (_v, key) => key.startsWith('_'));
        if (JSON.stringify(result) !== JSON.stringify({ id: 1, name: 'x' })) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
