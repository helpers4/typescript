/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { roundTo } from './roundTo';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'roundTo',
  category: 'number',
  examples: [
    {
      title: 'Round to 2 decimal places',
      description: 'Rounds a floating-point number to the specified number of decimals.',
      code: `roundTo(3.14159, 2)
// => 3.14`,
      assert: () => {
        if (roundTo(3.14159, 2) !== 3.14) throw new Error('Expected 3.14');
      },
    },
    {
      title: 'Round to 0 decimal places',
      description: 'Effectively rounds to the nearest integer.',
      code: `roundTo(3.7, 0)
// => 4`,
      assert: () => {
        if (roundTo(3.7, 0) !== 4) throw new Error('Expected 4');
      },
    },
  ],
};

export default examples;
