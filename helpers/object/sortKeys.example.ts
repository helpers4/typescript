/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sortKeys } from './sortKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sortKeys',
  category: 'object',
  examples: [
    {
      title: 'Sort object keys alphabetically',
      description: 'Useful for stable JSON.stringify output or predictable snapshot tests.',
      code: `sortKeys({ b: 2, a: 1, c: 3 })
// => { a: 1, b: 2, c: 3 }`,
      assert: () => {
        const result = sortKeys({ b: 2, a: 1, c: 3 });
        if (Object.keys(result).join(',') !== 'a,b,c') throw new Error('Unexpected key order');
      },
    },
  ],
};

export default examples;
