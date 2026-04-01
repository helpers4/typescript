/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { intersection } from './intersection';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'intersection',
  category: 'array',
  examples: [
    {
      title: 'Find common elements',
      description: 'Returns elements present in both arrays.',
      code: `intersection([1, 2, 3], [2, 3, 4])
// => [2, 3]`,
      assert: () => {
        const result = intersection([1, 2, 3], [2, 3, 4]);
        if (result.length !== 2 || result[0] !== 2 || result[1] !== 3) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
