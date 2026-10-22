/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isEmpty } from './isEmpty';

const examples: HelperExamples = {
  helper: 'isEmpty',
  category: 'string',
  examples: [
    {
      title: 'Check if a string is empty',
      description: 'Returns true only for `""`. Whitespace-only strings are not considered empty.',
      code: `isEmpty('')    // => true
isEmpty(' ')   // => false  (whitespace is content)
isEmpty('foo') // => false`,
      assert: () => {
        if (!isEmpty('')) throw new Error('"" should be empty');
        if (isEmpty(' ')) throw new Error('" " should not be empty');
        if (isEmpty('foo')) throw new Error('"foo" should not be empty');
      },
    },
    {
      title: 'Treat blank strings as empty by trimming first',
      description: 'Compose with .trim() when whitespace-only should also be considered empty.',
      code: `isEmpty(''.trim())   // => true
isEmpty('   '.trim()) // => true
isEmpty('hi'.trim())  // => false`,
      assert: () => {
        if (!isEmpty(''.trim())) throw new Error('Expected true');
        if (!isEmpty('   '.trim())) throw new Error('Expected true after trim');
        if (isEmpty('hi'.trim())) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
