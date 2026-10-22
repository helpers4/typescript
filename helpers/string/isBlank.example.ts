/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isBlank } from './isBlank';

const examples: HelperExamples = {
  helper: 'isBlank',
  category: 'string',
  examples: [
    {
      title: 'Detect empty or whitespace-only strings',
      description:
        'Returns true for "" and for any string made entirely of whitespace — including ' +
        'non-breaking space (U+00A0), en/em spaces, ideographic space, and BOM.',
      code: `isBlank('')      // => true
isBlank('   ')   // => true
isBlank('\\t\\n')  // => true
isBlank(' ')     // => true   (non-breaking space U+00A0)
isBlank('foo')   // => false
isBlank(' x ')   // => false`,
      assert: () => {
        if (!isBlank('')) throw new Error('Expected true for ""');
        if (!isBlank('   ')) throw new Error('Expected true for spaces');
        if (!isBlank(' ')) throw new Error('Expected true for NBSP');
        if (isBlank('foo')) throw new Error('Expected false for "foo"');
      },
    },
    {
      title: 'Form validation — reject blank input',
      description: 'Use isBlank to reject fields that contain only whitespace.',
      code: `function validateName(name: string): string | null {
  if (isBlank(name)) return 'Name is required';
  return null;
}
validateName('')    // => 'Name is required'
validateName('   ') // => 'Name is required'
validateName('Ada') // => null`,
      assert: () => {
        function validateName(name: string): string | null {
          if (isBlank(name)) return 'Name is required';
          return null;
        }
        if (validateName('') === null) throw new Error('Expected error for ""');
        if (validateName('   ') === null) throw new Error('Expected error for spaces');
        if (validateName('Ada') !== null) throw new Error('Expected null for "Ada"');
      },
    },
  ],
};

export default examples;
