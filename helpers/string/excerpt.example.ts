/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { excerpt } from './excerpt';

const examples: HelperExamples = {
  helper: 'excerpt',
  category: 'string',
  examples: [
    {
      title: 'Cut at the end of a whole sentence',
      description: 'Prefers a clean sentence break over a hard character cutoff, even if the result ends up shorter than maxLength.',
      code: `excerpt(
  'Build the biggest, best theme park rides ever seen. Can you make money in this business?',
  60,
)
// => 'Build the biggest, best theme park rides ever seen.'`,
      assert: () => {
        const result = excerpt(
          'Build the biggest, best theme park rides ever seen. Can you make money in this business?',
          60,
        );
        if (result !== 'Build the biggest, best theme park rides ever seen.') throw new Error('Unexpected excerpt');
      },
    },
    {
      title: 'Fall back to the last whole word',
      description: 'No sentence boundary fits, so it cuts at the last complete word and appends an ellipsis — never a partial word.',
      code: `excerpt('This description has no punctuation at all so it must cut on a word', 30)
// => 'This description has no…'`,
      assert: () => {
        const result = excerpt('This description has no punctuation at all so it must cut on a word', 30);
        if (result !== 'This description has no…') throw new Error('Unexpected excerpt');
      },
    },
    {
      title: 'Already short enough — returned unchanged',
      description: 'Only whitespace is normalized; nothing is cut when the text already fits.',
      code: `excerpt('A short game about ducks.', 200)
// => 'A short game about ducks.'`,
      assert: () => {
        if (excerpt('A short game about ducks.', 200) !== 'A short game about ducks.') throw new Error('Expected no change');
      },
    },
  ],
};

export default examples;
