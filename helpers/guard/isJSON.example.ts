/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSON } from './isJSON';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJSON',
  category: 'guard',
  examples: [
    {
      title: 'Check a string before parsing it',
      description: 'Validates that a string is parseable JSON before calling JSON.parse.',
      code: `isJSON('{"a":1}')
// => true
isJSON('not json')
// => false`,
      assert: () => {
        if (!isJSON('{"a":1}')) throw new Error('Expected true');
        if (isJSON('not json')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
