/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { randomBetween, randomIntBetween } from './random';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'random',
  category: 'number',
  examples: [
    {
      title: 'Generate a random float in range',
      description: 'Returns a random number between min and max (inclusive).',
      code: `randomBetween(1, 10)
// => e.g. 5.327...`,
      assert: () => {
        const result = randomBetween(1, 10);
        if (result < 1 || result > 10) throw new Error(`Out of range: ${result}`);
      },
    },
    {
      title: 'Generate a random integer in range',
      description: 'Returns a random integer between min and max (inclusive).',
      code: `randomIntBetween(1, 6)
// => e.g. 4`,
      assert: () => {
        const result = randomIntBetween(1, 6);
        if (!Number.isInteger(result) || result < 1 || result > 6) throw new Error(`Invalid: ${result}`);
      },
    },
  ],
};

export default examples;
