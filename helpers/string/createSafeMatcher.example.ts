/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createSafeMatcher } from './createSafeMatcher';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createSafeMatcher',
  category: 'string',
  examples: [
    {
      title: 'Validate a user filter',
      description: 'An invalid regular expression gives null, to report it without a try.',
      code: `const matches = createSafeMatcher(input);
if (!matches) console.error('Invalid filter');`,
      assert: () => {
        if (createSafeMatcher('/(/') !== null) throw new Error('Expected null');
      },
    },
    {
      title: 'Use it like createMatcher',
      description: 'For valid patterns, the result is the same predicate.',
      code: `createSafeMatcher('*.fig')?.('a.fig') // => true`,
      assert: () => {
        if (createSafeMatcher('*.fig')?.('a.fig') !== true) throw new Error('Expected a match');
      },
    },
  ],
};

export default examples;
