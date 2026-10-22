/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { words } from './words';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'words',
  category: 'string',
  examples: [
    {
      title: 'Split common string formats',
      description: 'Splits camelCase, PascalCase, snake_case, kebab-case and space-separated words.',
      code: `words('camelCaseString') // => ['camel', 'Case', 'String']
words('snake_case')       // => ['snake', 'case']
words('kebab-case')       // => ['kebab', 'case']
words('hello world')      // => ['hello', 'world']`,
      assert: () => {
        if (JSON.stringify(words('camelCaseString')) !== JSON.stringify(['camel', 'Case', 'String']))
          throw new Error('camelCase failed');
        if (JSON.stringify(words('snake_case')) !== JSON.stringify(['snake', 'case']))
          throw new Error('snake_case failed');
      },
    },
    {
      title: 'Build camelCase from any input',
      description: 'Combine with a map to convert from any naming convention.',
      code: `const toCamel = (str: string) =>
  words(str)
    .map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('');
toCamel('hello-world'); // => 'helloWorld'`,
      assert: () => {
        const toCamel = (str: string) =>
          words(str)
            .map((w, i) => (i === 0 ? w.toLowerCase() : w[0]!.toUpperCase() + w.slice(1).toLowerCase()))
            .join('');
        if (toCamel('hello-world') !== 'helloWorld') throw new Error('Expected helloWorld');
      },
    },
  ],
};

export default examples;
