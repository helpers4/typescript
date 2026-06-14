/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isNonEmpty } from './isNonEmpty';

const examples: HelperExamples = {
  helper: 'isNonEmpty',
  category: 'string',
  examples: [
    {
      title: 'Check if a string has content',
      description: 'Returns true for any string with at least one character, including whitespace.',
      code: `isNonEmpty('hello') // => true
isNonEmpty(' ')     // => true  (whitespace is content)
isNonEmpty('')      // => false`,
      assert: () => {
        if (!isNonEmpty('hello')) throw new Error('"hello" should be non-empty');
        if (!isNonEmpty(' ')) throw new Error('" " should be non-empty');
        if (isNonEmpty('')) throw new Error('"" should not be non-empty');
      },
    },
    {
      title: 'Exclude blank strings by trimming first',
      description: 'Compose with .trim() when whitespace-only strings should be treated as empty.',
      code: `isNonEmpty('hello'.trim()) // => true
isNonEmpty('   '.trim())   // => false
isNonEmpty(''.trim())      // => false`,
      assert: () => {
        if (!isNonEmpty('hello'.trim())) throw new Error('Expected true');
        if (isNonEmpty('   '.trim())) throw new Error('Expected false after trim');
        if (isNonEmpty(''.trim())) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
