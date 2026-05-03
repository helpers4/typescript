/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { capitalize } from './capitalize';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'capitalize',
  category: 'string',
  examples: [
    {
      title: 'Capitalize a word',
      description: 'Uppercases the first letter and lowercases the rest.',
      code: `capitalize('hello')
// => 'Hello'`,
      assert: () => {
        if (capitalize('hello') !== 'Hello') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Handle mixed case',
      description: 'Lowercases all letters except the first one (default behaviour).',
      code: `capitalize('hELLO')
// => 'Hello'`,
      assert: () => {
        if (capitalize('hELLO') !== 'Hello') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Uppercase first only — leave rest untouched',
      description: 'Use { lowercaseRest: false } to preserve the original casing of the remaining characters.',
      code: `capitalize('hELLO', { lowercaseRest: false })
// => 'HELLO'`,
      assert: () => {
        if (capitalize('hELLO', { lowercaseRest: false }) !== 'HELLO') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
