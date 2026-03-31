/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isEmpty } from './isEmpty';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isEmpty',
  category: 'type',
  examples: [
    {
      title: 'Check empty values',
      description: 'Returns true for null, undefined, empty strings, arrays, objects, Maps, and Sets.',
      code: `isEmpty('')     // => true
isEmpty([])     // => true
isEmpty({})     // => true
isEmpty(null)   // => true`,
      assert: () => {
        if (!isEmpty('')) throw new Error('Expected true for empty string');
        if (!isEmpty([])) throw new Error('Expected true for empty array');
        if (!isEmpty({})) throw new Error('Expected true for empty object');
        if (!isEmpty(null)) throw new Error('Expected true for null');
      },
    },
    {
      title: 'Non-empty values',
      description: 'Returns false for values with content.',
      code: `isEmpty('hello') // => false
isEmpty([1])     // => false
isEmpty(42)      // => false`,
      assert: () => {
        if (isEmpty('hello')) throw new Error('Expected false for non-empty string');
        if (isEmpty([1])) throw new Error('Expected false for non-empty array');
        if (isEmpty(42)) throw new Error('Expected false for number');
      },
    },
  ],
};

export default examples;
