/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { daysDifference } from './difference';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'daysDifference',
  category: 'date',
  examples: [
    {
      title: 'Calculate days between two dates',
      description: 'Returns the absolute number of days between two dates.',
      code: `daysDifference(new Date('2025-01-01'), new Date('2025-01-10'))
// => 9`,
      assert: () => {
        const result = daysDifference(new Date('2025-01-01'), new Date('2025-01-10'));
        if (result !== 9) throw new Error(`Expected 9, got ${result}`);
      },
    },
  ],
};

export default examples;
