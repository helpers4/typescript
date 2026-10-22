/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSONValue } from './isJSONValue';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJSONValue',
  category: 'guard',
  examples: [
    {
      title: 'Validate a value before sending it as JSON',
      description: 'Recursively checks that a value only contains JSON-representable types.',
      code: `isJSONValue({ a: [1, 'two', null, { b: true }] })
// => true
isJSONValue({ a: new Date() })
// => false`,
      assert: () => {
        if (!isJSONValue({ a: [1, 'two', null, { b: true }] })) throw new Error('Expected true');
        if (isJSONValue({ a: new Date() })) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
