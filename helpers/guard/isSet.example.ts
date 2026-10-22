/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isSet } from './isSet';

const examples: HelperExamples = {
  helper: 'isSet',
  category: 'guard',
  examples: [
    {
      title: 'Check whether a value is a Set',
      description: 'Returns true only for real Set instances.',
      code: `isSet(new Set([1, 2, 3])) // => true
isSet([1, 2, 3])          // => false`,
      assert: () => {
        if (!isSet(new Set([1, 2, 3]))) throw new Error('Expected a Set to pass');
        if (isSet([1, 2, 3])) throw new Error('Expected an array to fail');
      },
    },
    {
      title: 'Type-safe narrowing in a conditional',
      description: 'Inside the `if` branch, the value is narrowed to Set<unknown>.',
      code: `const value: unknown = new Set(['a', 'b']);
if (isSet(value)) {
  value.size // => 2, type-safe access
}`,
      assert: () => {
        const value: unknown = new Set(['a', 'b']);
        if (!isSet(value)) throw new Error('Expected a Set');
        if (value.size !== 2) throw new Error('Expected size 2');
      },
    },
  ],
};

export default examples;
