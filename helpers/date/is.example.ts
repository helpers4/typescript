/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isSameDay } from './is';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isSameDay',
  category: 'date',
  examples: [
    {
      title: 'Same day, different times',
      description: 'Returns true when both dates are on the same calendar day.',
      code: `isSameDay(new Date('2025-01-19T08:00:00'), new Date('2025-01-19T22:00:00'))
// => true`,
      assert: () => {
        if (!isSameDay(new Date('2025-01-19T08:00:00'), new Date('2025-01-19T22:00:00')))
          throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
