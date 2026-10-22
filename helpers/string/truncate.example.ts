/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { truncate } from './truncate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'truncate',
  category: 'string',
  examples: [
    {
      title: 'Truncate with default ellipsis',
      description: 'Appends … when the string exceeds the limit, trimming a trailing space at the cut point.',
      code: `truncate('Hello, world!', 8)
// => 'Hello,…'`,
      assert: () => {
        if (truncate('Hello, world!', 8) !== 'Hello,…') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Truncate with custom ellipsis',
      description: 'The ellipsis counts toward the maxLength.',
      code: `truncate('Hello, world!', 8, '...')
// => 'Hello...'`,
      assert: () => {
        if (truncate('Hello, world!', 8, '...') !== 'Hello...') throw new Error('Unexpected result');
      },
    },
    {
      title: 'String within limit',
      description: 'Returned unchanged when already short enough.',
      code: `truncate('Hi', 10)
// => 'Hi'`,
      assert: () => {
        if (truncate('Hi', 10) !== 'Hi') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
