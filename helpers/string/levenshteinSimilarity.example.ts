/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { levenshteinSimilarity } from './levenshteinSimilarity';

const examples: HelperExamples = {
  helper: 'levenshteinSimilarity',
  category: 'string',
  examples: [
    {
      title: 'Score how close two strings are',
      description: 'A normalized [0, 1] score, handy for fuzzy-matching/ranking.',
      code: `levenshteinSimilarity('kitten', 'sitting')
// => 0.5714285714285714`,
      assert: () => {
        const score = levenshteinSimilarity('kitten', 'sitting');
        if (Math.abs(score - (1 - 3 / 7)) > 1e-10) throw new Error('Unexpected similarity score');
      },
    },
    {
      title: 'Identical strings score 1',
      description: 'Useful as a fuzzy-matching threshold cutoff.',
      code: `levenshteinSimilarity('same', 'same')
// => 1`,
      assert: () => {
        if (levenshteinSimilarity('same', 'same') !== 1) throw new Error('Expected a perfect score');
      },
    },
  ],
};

export default examples;
