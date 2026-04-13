/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { pick } from './pick';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'pick',
  category: 'object',
  examples: [
    {
      title: 'Pick specific keys',
      description: 'Creates a new object with only the specified keys.',
      code: `pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])
// => { a: 1, c: 3 }`,
      assert: () => {
        const result = pick({ a: 1, b: 2, c: 3 }, ['a', 'c']);
        if (result.a !== 1 || result.c !== 3) throw new Error('Unexpected result');
        if ('b' in result) throw new Error('Should not contain b');
      },
    },
    {
      title: 'Extract user fields',
      description: 'Useful to select only the fields you need from an object.',
      code: `const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' };
pick(user, ['id', 'name', 'email'])
// => { id: 1, name: 'Alice', email: 'alice@example.com' }`,
      assert: () => {
        const user = { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret' };
        const result = pick(user, ['id', 'name', 'email']);
        if ('password' in result) throw new Error('Should not contain password');
        if (result.name !== 'Alice') throw new Error('Unexpected name');
      },
    },
  ],
};

export default examples;
