/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePatternOrRegExp } from './parsePatternOrRegExp';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parsePatternOrRegExp',
  category: 'string',
  examples: [
    {
      title: 'Glob or regular expression',
      description: 'A /source/flags string is a regular expression; anything else is a glob.',
      code: `parsePatternOrRegExp('SF Pro*').test('SF Pro Display') // => true
parsePatternOrRegExp('/^SF Pro/i').test('sf pro text') // => true`,
      assert: () => {
        if (!parsePatternOrRegExp('SF Pro*').test('SF Pro Display')) throw new Error('Expected a glob match');
        if (!parsePatternOrRegExp('/^SF Pro/i').test('sf pro text')) throw new Error('Expected a regexp match');
      },
    },
  ],
};

export default examples;
