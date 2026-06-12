/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { correctFloat } from './correctFloat';

const examples: HelperExamples = {
  helper: 'correctFloat',
  category: 'number',
  examples: [
    {
      title: 'Fix floating-point drift',
      description: 'Corrects the classic 0.1 + 0.2 floating-point arithmetic error.',
      code: `0.1 + 0.2              // => 0.30000000000000004
correctFloat(0.1 + 0.2)  // => 0.3`,
      assert: () => {
        if (correctFloat(0.1 + 0.2) !== 0.3) throw new Error('Expected 0.3');
      },
    },
    {
      title: 'Custom significant-digit precision',
      description: 'Pass a second argument to control how many significant digits to keep.',
      code: `correctFloat(1.23456789, 4)  // => 1.235
correctFloat(1.23456789, 6)  // => 1.23457`,
      assert: () => {
        if (correctFloat(1.23456789, 4) !== 1.235) throw new Error('Expected 1.235');
        if (correctFloat(1.23456789, 6) !== 1.23457) throw new Error('Expected 1.23457');
      },
    },
  ],
};

export default examples;
