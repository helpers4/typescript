/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createGlobMatcher } from './createGlobMatcher';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createGlobMatcher',
  category: 'string',
  examples: [
    {
      title: 'Filter paths',
      description: 'Strings are always globs, so a path is never taken for a regular expression.',
      code: `const isSource = createGlobMatcher(['/src/*.ts', '!*.test.ts']);
isSource('/src/index.ts')      // => true
isSource('/src/index.test.ts') // => false`,
      assert: () => {
        const isSource = createGlobMatcher(['/src/*.ts', '!*.test.ts']);
        if (!isSource('/src/index.ts') || isSource('/src/index.test.ts')) throw new Error('Unexpected match');
      },
    },
    {
      title: 'Ignore case',
      description: 'caseSensitive: false matches letters of any case.',
      code: `createGlobMatcher('*.FIG', { caseSensitive: false })('a.fig') // => true`,
      assert: () => {
        if (!createGlobMatcher('*.FIG', { caseSensitive: false })('a.fig')) throw new Error('Expected a match');
      },
    },
  ],
};

export default examples;
