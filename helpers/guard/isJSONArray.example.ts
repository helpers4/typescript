/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSONArray } from './isJSONArray';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJSONArray',
  category: 'guard',
  examples: [
    {
      title: 'Validate a JSON array',
      description: 'Checks that a value is an array whose every element is JSON-representable.',
      code: `isJSONArray([1, 'two', null])
// => true
isJSONArray([1, undefined])
// => false`,
      assert: () => {
        if (!isJSONArray([1, 'two', null])) throw new Error('Expected true');
        if (isJSONArray([1, undefined])) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
