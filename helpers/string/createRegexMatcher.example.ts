/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createRegexMatcher } from './createRegexMatcher';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createRegexMatcher',
  category: 'string',
  examples: [
    {
      title: 'A setting documented as a regular expression',
      description: 'The string is the source, without slashes.',
      code: `createRegexMatcher('^(Home|Login)$')('Login') // => true`,
      assert: () => {
        if (!createRegexMatcher('^(Home|Login)$')('Login')) throw new Error('Expected a match');
      },
    },
    {
      title: 'Ignore case',
      description: 'caseSensitive: false adds the i flag.',
      code: `createRegexMatcher('^icon-\\\\d+$', { caseSensitive: false })('Icon-42') // => true`,
      assert: () => {
        if (!createRegexMatcher('^icon-\\d+$', { caseSensitive: false })('Icon-42')) throw new Error('Expected a match');
      },
    },
  ],
};

export default examples;
