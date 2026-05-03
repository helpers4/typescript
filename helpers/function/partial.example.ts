/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { partial } from './partial';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'partial',
  category: 'function',
  examples: [
    {
      title: 'Create a specialised multiplier',
      description: 'Pre-fill the first argument to derive a specialised function.',
      code: `const multiply = (a: number, b: number) => a * b;
const double = partial(multiply, 2);
const triple = partial(multiply, 3);

double(5); // => 10
triple(5); // => 15`,
      assert: () => {
        const multiply = (a: number, b: number) => a * b;
        const double = partial(multiply, 2);
        if (double(5) !== 10) throw new Error('Expected 10');
        if (partial(multiply, 3)(5) !== 15) throw new Error('Expected 15');
      },
    },
    {
      title: 'Pre-fill multiple arguments',
      description: 'Supply several arguments up front, leaving only the last one open.',
      code: `const format = (prefix: string, sep: string, value: string) =>
  \`\${prefix}\${sep}\${value}\`;

const withLabel = partial(format, 'Status', ': ');
withLabel('passing'); // => 'Status: passing'`,
      assert: () => {
        const format = (prefix: string, sep: string, value: string) => `${prefix}${sep}${value}`;
        const withLabel = partial(format, 'Status', ': ');
        if (withLabel('passing') !== 'Status: passing') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
