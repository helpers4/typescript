/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isSpecialObject } from './isSpecialObject';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isSpecialObject',
  category: 'type',
  examples: [
    {
      title: 'Detect special objects',
      description: 'Returns true for built-in objects like Date, Map, Set, RegExp, etc.',
      code: `isSpecialObject(new Date())     // => true
isSpecialObject(new Map())      // => true
isSpecialObject(/regex/)        // => true`,
      assert: () => {
        if (!isSpecialObject(new Date())) throw new Error('Expected true for Date');
        if (!isSpecialObject(new Map())) throw new Error('Expected true for Map');
        if (!isSpecialObject(/regex/)) throw new Error('Expected true for RegExp');
      },
    },
    {
      title: 'Plain objects are not special',
      description: 'Returns false for plain objects and arrays.',
      code: `isSpecialObject({ a: 1 })  // => false
isSpecialObject([1, 2])    // => false`,
      assert: () => {
        if (isSpecialObject({ a: 1 })) throw new Error('Expected false for plain object');
        if (isSpecialObject([1, 2])) throw new Error('Expected false for array');
      },
    },
  ],
};

export default examples;
