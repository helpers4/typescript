/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { omit } from './omit';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'omit',
  category: 'object',
  examples: [
    {
      title: 'Omit specific keys',
      description: 'Creates a new object without the specified keys.',
      code: `omit({ a: 1, b: 2, c: 3 }, ['b'])
// => { a: 1, c: 3 }`,
      assert: () => {
        const result = omit({ a: 1, b: 2, c: 3 }, ['b']);
        if (result.a !== 1 || result.c !== 3) throw new Error('Unexpected result');
        if ('b' in result) throw new Error('Should not contain b');
      },
    },
    {
      title: 'Remove sensitive fields',
      description: 'Useful to strip sensitive data before sending to client.',
      code: `const user = { id: 1, name: 'Alice', password: 'secret', token: 'abc123' };
omit(user, ['password', 'token'])
// => { id: 1, name: 'Alice' }`,
      assert: () => {
        const user = { id: 1, name: 'Alice', password: 'secret', token: 'abc123' };
        const result = omit(user, ['password', 'token']);
        if ('password' in result || 'token' in result) throw new Error('Should not contain sensitive fields');
        if (result.name !== 'Alice') throw new Error('Unexpected name');
      },
    },
  ],
};

export default examples;
