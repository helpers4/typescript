/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { leadingSentence } from './leadingSentence';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'leadingSentence',
  category: 'string',
  examples: [
    {
      title: 'Extract the leading sentence',
      description: 'Returns the first sentence, terminated by . ? or !.',
      code: `leadingSentence('Returns the sum of an array. Works with any numbers.')
// => 'Returns the sum of an array.'`,
      assert: () => {
        const result = leadingSentence('Returns the sum of an array. Works with any numbers.');
        if (result !== 'Returns the sum of an array.') throw new Error('Got: ' + result);
      },
    },
    {
      title: 'Works with ? and !',
      description: 'Recognises question marks and exclamation marks as sentence terminators.',
      code: `leadingSentence('Is it done? Yes it is!')
// => 'Is it done?'`,
      assert: () => {
        const result = leadingSentence('Is it done? Yes it is!');
        if (result !== 'Is it done?') throw new Error('Got: ' + result);
      },
    },
    {
      title: 'Cap length by combining with truncate',
      description: 'Use truncate to limit the result to a fixed number of characters.',
      code: `truncate(leadingSentence(input), 120)`,
      assert: () => { /* combination example */ },
    },
  ],
};

export default examples;
