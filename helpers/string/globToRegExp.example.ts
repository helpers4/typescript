/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { globToRegExp } from './globToRegExp';

const examples: HelperExamples = {
  helper: 'globToRegExp',
  category: 'string',
  examples: [
    {
      title: 'Match a file extension pattern',
      description: '"*" matches any sequence of characters.',
      code: `globToRegExp('*.test.ts').test('helper.test.ts')
// => true`,
      assert: () => {
        if (!globToRegExp('*.test.ts').test('helper.test.ts')) throw new Error('Expected a match');
      },
    },
    {
      title: 'Match a fixed-width placeholder with "?"',
      description: '"?" matches exactly one character — handy for fixed-width codes.',
      code: `globToRegExp('report-????.csv').test('report-2026.csv')
// => true`,
      assert: () => {
        if (!globToRegExp('report-????.csv').test('report-2026.csv')) throw new Error('Expected a match');
      },
    },
    {
      title: 'Reuse the same pattern for many strings efficiently',
      description: 'Compile once with memoize() from @helpers4/function when checking many candidates against a fixed pattern list.',
      code: `const isTestFile = globToRegExp('*.test.ts');
['a.test.ts', 'a.spec.ts'].filter(name => isTestFile.test(name))
// => ['a.test.ts']`,
      assert: () => {
        const isTestFile = globToRegExp('*.test.ts');
        const result = ['a.test.ts', 'a.spec.ts'].filter((name) => isTestFile.test(name));
        if (result.length !== 1 || result[0] !== 'a.test.ts') throw new Error('Unexpected filter result');
      },
    },
  ],
};

export default examples;
