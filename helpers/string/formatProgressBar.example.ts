/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatProgressBar } from './formatProgressBar';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatProgressBar',
  category: 'string',
  examples: [
    {
      title: 'Default 20-cell bar',
      description: 'Renders a percentage as a filled/empty block bar using the default width and characters.',
      code: `formatProgressBar(65)
// => '▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░'`,
      assert: () => {
        if (formatProgressBar(65) !== '▓'.repeat(13) + '░'.repeat(7)) throw new Error('Expected a 13/20 filled bar');
      },
    },
    {
      title: 'Custom width, characters, and scale',
      description: 'Renders a value against a custom max, width, and fill characters — useful for anything scored out of a different total than 100.',
      code: `formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' })
// => '######----'`,
      assert: () => {
        const bar = formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' });
        if (bar !== '######----') throw new Error('Expected ######----');
      },
    },
  ],
};

export default examples;
