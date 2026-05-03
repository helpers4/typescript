/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { groupBy } from './groupBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'groupBy',
  category: 'object',
  examples: [
    {
      title: 'Group numbers by parity',
      code: `groupBy([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd')
// => { odd: [1, 3], even: [2, 4] }`,
      assert: () => {
        const result = groupBy([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd');
        if (JSON.stringify(result) !== JSON.stringify({ odd: [1, 3], even: [2, 4] }))
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Group objects by a property',
      code: `const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob',   role: 'user'  },
  { name: 'Carol', role: 'admin' },
];
groupBy(users, u => u.role)
// => { admin: [{...Alice}, {...Carol}], user: [{...Bob}] }`,
      assert: () => {
        const users = [
          { name: 'Alice', role: 'admin' },
          { name: 'Bob', role: 'user' },
          { name: 'Carol', role: 'admin' },
        ];
        const result = groupBy(users, u => u.role);
        if (result['admin']?.length !== 2) throw new Error('Expected 2 admins');
        if (result['user']?.length !== 1) throw new Error('Expected 1 user');
      },
    },
  ],
};

export default examples;
