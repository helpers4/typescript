/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNullish } from './isNullish';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isNullish',
  category: 'type',
  examples: [
    {
      title: 'Check for null or undefined',
      description: 'Returns true only for null and undefined, not other falsy values.',
      code: `isNullish(null)      // => true
isNullish(undefined) // => true
isNullish(0)         // => false
isNullish('')        // => false`,
      assert: () => {
        if (!isNullish(null)) throw new Error('null should be nullish');
        if (!isNullish(undefined)) throw new Error('undefined should be nullish');
        if (isNullish(0)) throw new Error('0 should not be nullish');
        if (isNullish('')) throw new Error('"" should not be nullish');
      },
    },
    {
      title: 'Guard before accessing properties',
      description: 'Use as a type guard to safely narrow types.',
      code: `function greet(name: string | null | undefined): string {
  if (isNullish(name)) return 'Hello, stranger!';
  return \`Hello, \${name}!\`;
}
greet(null) // => 'Hello, stranger!'`,
      assert: () => {
        const greet = (name: string | null | undefined): string => {
          if (isNullish(name)) return 'Hello, stranger!';
          return `Hello, ${name}!`;
        };
        if (greet(null) !== 'Hello, stranger!') throw new Error('Unexpected result for null');
        if (greet('Alice') !== 'Hello, Alice!') throw new Error('Unexpected result for Alice');
      },
    },
  ],
};

export default examples;
