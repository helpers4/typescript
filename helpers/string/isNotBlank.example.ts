/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isNotBlank } from './isNotBlank';

const examples: HelperExamples = {
  helper: 'isNotBlank',
  category: 'string',
  examples: [
    {
      title: 'Check that a string has real content',
      description:
        'Returns true only when the string contains at least one non-whitespace character.',
      code: `isNotBlank('foo')  // => true
isNotBlank(' x ')  // => true
isNotBlank('')     // => false
isNotBlank('   ')  // => false
isNotBlank('\\t')   // => false`,
      assert: () => {
        if (!isNotBlank('foo')) throw new Error('Expected true for "foo"');
        if (!isNotBlank(' x ')) throw new Error('Expected true for " x "');
        if (isNotBlank('')) throw new Error('Expected false for ""');
        if (isNotBlank('   ')) throw new Error('Expected false for spaces');
      },
    },
    {
      title: 'Filter out blank strings from an array',
      description: 'Use as a predicate in .filter() to keep only strings with real content.',
      code: `const tags = ['typescript', '  ', '', 'helpers'];
tags.filter(isNotBlank)
// => ['typescript', 'helpers']`,
      assert: () => {
        const tags = ['typescript', '  ', '', 'helpers'];
        const result = tags.filter(isNotBlank);
        if (result.length !== 2) throw new Error('Expected ["typescript", "helpers"]');
      },
    },
  ],
};

export default examples;
