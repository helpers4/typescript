/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { levenshteinDistance } from './levenshteinDistance';

const examples: HelperExamples = {
  helper: 'levenshteinDistance',
  category: 'string',
  examples: [
    {
      title: 'Classic edit-distance example',
      description: '"kitten" becomes "sitting" with 3 single-character edits.',
      code: `levenshteinDistance('kitten', 'sitting')
// => 3`,
      assert: () => {
        if (levenshteinDistance('kitten', 'sitting') !== 3) throw new Error('Unexpected distance');
      },
    },
    {
      title: 'Case-insensitive comparison',
      description: 'Pass `false` to ignore letter case when comparing.',
      code: `levenshteinDistance('Kitten', 'kitten', false)
// => 0`,
      assert: () => {
        if (levenshteinDistance('Kitten', 'kitten', false) !== 0) throw new Error('Expected case-insensitive match');
      },
    },
  ],
};

export default examples;
