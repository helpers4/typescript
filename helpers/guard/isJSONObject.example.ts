/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJSONObject } from './isJSONObject';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJSONObject',
  category: 'guard',
  examples: [
    {
      title: 'Validate a JSON object',
      description: 'Checks that a value is a plain object whose every value is JSON-representable.',
      code: `isJSONObject({ a: 1, b: 'two' })
// => true
isJSONObject({ a: undefined })
// => false`,
      assert: () => {
        if (!isJSONObject({ a: 1, b: 'two' })) throw new Error('Expected true');
        if (isJSONObject({ a: undefined })) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
