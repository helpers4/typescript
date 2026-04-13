/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compact } from './compact';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'compact',
  category: 'object',
  examples: [
    {
      title: 'Remove falsy values from object',
      description: 'Removes all entries with falsy values (false, null, undefined, 0, "", NaN).',
      code: `compact({ a: 1, b: null, c: '', d: 0, e: 'hello' })
// => { a: 1, e: 'hello' }`,
      assert: () => {
        const result = compact({ a: 1, b: null, c: '', d: 0, e: 'hello' });
        if (Object.keys(result).length !== 2) throw new Error('Expected 2 keys');
      },
    },
    {
      title: 'Clean up API response',
      description: 'Useful to strip empty or missing fields before sending data.',
      code: `compact({ name: 'Alice', email: '', age: 0, role: 'admin' })
// => { name: 'Alice', role: 'admin' }`,
      assert: () => {
        const result = compact({ name: 'Alice', email: '', age: 0, role: 'admin' });
        if (Object.keys(result).length !== 2) throw new Error('Expected 2 keys');
      },
    },
  ],
};

export default examples;
