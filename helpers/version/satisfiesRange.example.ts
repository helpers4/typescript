/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { satisfiesRange } from './satisfiesRange';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'satisfiesRange',
  category: 'version',
  examples: [
    {
      title: 'Check caret range',
      description: 'Caret (^) allows patch and minor updates within the same major.',
      code: `satisfiesRange('1.2.3', '^1.0.0')
// => true`,
      assert: () => {
        if (!satisfiesRange('1.2.3', '^1.0.0')) throw new Error('Expected true');
      },
    },
    {
      title: 'Check greater-than-or-equal range',
      description: 'The >= operator checks if the version is at least the specified value.',
      code: `satisfiesRange('2.0.0', '>=1.5.0')
// => true`,
      assert: () => {
        if (!satisfiesRange('2.0.0', '>=1.5.0')) throw new Error('Expected true');
      },
    },
    {
      title: 'Out of range',
      description: 'Returns false when the version does not satisfy the range.',
      code: `satisfiesRange('0.9.0', '>=1.0.0')
// => false`,
      assert: () => {
        if (satisfiesRange('0.9.0', '>=1.0.0')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
