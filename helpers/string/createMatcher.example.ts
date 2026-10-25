/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createMatcher } from './createMatcher';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createMatcher',
  category: 'string',
  examples: [
    {
      title: 'Filter names with globs, regular expressions and exclusions',
      description: 'An array matches when one pattern matches and no ! exclusion does.',
      code: `const isScreen = createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);
isScreen('Screen 2')       // => true
isScreen('Login')          // => true
isScreen('Screen 2 (old)') // => false`,
      assert: () => {
        const isScreen = createMatcher(['Screen *', '/^(Home|Login)$/', '!* (old)']);
        if (!isScreen('Screen 2') || !isScreen('Login') || isScreen('Screen 2 (old)')) throw new Error('Unexpected match');
      },
    },
    {
      title: 'Paths only',
      description: "With syntax 'glob', a pattern like /usr/lib/img is never read as a regular expression.",
      code: `createMatcher('/usr/lib/*', { syntax: 'glob' })('/usr/lib/img') // => true`,
      assert: () => {
        if (!createMatcher('/usr/lib/*', { syntax: 'glob' })('/usr/lib/img')) throw new Error('Expected a match');
      },
    },
    {
      title: 'Fix the reading of one pattern with re: or glob:',
      description: 'A prefix overrides the syntax option for that pattern only, so globs and regular expressions mix freely.',
      code: `const matches = createMatcher(['glob:src/*', 're:\\\\.tsx?$', '!re:test']);
matches('lib/b.ts')      // => true
matches('lib/b.test.ts') // => false`,
      assert: () => {
        const matches = createMatcher(['glob:src/*', 're:\\.tsx?$', '!re:test']);
        if (!matches('lib/b.ts') || matches('lib/b.test.ts')) throw new Error('Expected prefixes to apply per pattern');
      },
    },
  ],
};

export default examples;
