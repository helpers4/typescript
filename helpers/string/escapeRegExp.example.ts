/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { escapeRegExp } from './escapeRegExp';

const examples: HelperExamples = {
  helper: 'escapeRegExp',
  category: 'string',
  examples: [
    {
      title: 'Escape metacharacters before building a RegExp',
      description: 'Without escaping, "." and "?" would change the pattern\'s meaning.',
      code: `escapeRegExp('1 + 1 = 2?')
// => '1 \\\\+ 1 = 2\\\\?'`,
      assert: () => {
        if (escapeRegExp('1 + 1 = 2?') !== '1 \\+ 1 = 2\\?') throw new Error('Unexpected escaping');
      },
    },
    {
      title: 'Safely search for untrusted user input',
      description: 'Escaping lets user-provided text be matched literally instead of as a pattern.',
      code: `const userInput = 'a.b';
new RegExp(escapeRegExp(userInput)).test('a.b')   // => true
new RegExp(escapeRegExp(userInput)).test('axb')   // => false (literal '.', not "any char")`,
      assert: () => {
        const userInput = 'a.b';
        const pattern = new RegExp(escapeRegExp(userInput));
        if (!pattern.test('a.b')) throw new Error('Expected literal match');
        if (pattern.test('axb')) throw new Error('Expected "." to be treated literally, not as a wildcard');
      },
    },
  ],
};

export default examples;
