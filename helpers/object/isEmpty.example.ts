/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isEmpty } from './isEmpty';

const examples: HelperExamples = {
  helper: 'isEmpty',
  category: 'object',
  examples: [
    {
      title: 'Check if an object has no own string-keyed properties',
      description: 'Returns true for `{}`. Symbol-keyed properties are not counted.',
      code: `isEmpty({})              // => true
isEmpty({ a: 1 })        // => false
isEmpty({ a: undefined }) // => false  (key exists even if value is undefined)`,
      assert: () => {
        if (!isEmpty({})) throw new Error('{} should be empty');
        if (isEmpty({ a: 1 })) throw new Error('{a:1} should not be empty');
        if (isEmpty({ a: undefined })) throw new Error('{a:undefined} should not be empty');
      },
    },
    {
      title: 'Symbol keys are not counted',
      description: 'An object with only symbol-keyed properties is considered empty.',
      code: `const sym = Symbol('x');
const obj = { [sym]: 1 };
isEmpty(obj) // => true  (only string keys are counted)`,
      assert: () => {
        const sym = Symbol('x');
        const obj: Record<PropertyKey, unknown> = { [sym]: 1 };
        if (!isEmpty(obj)) throw new Error('Object with only symbol key should be empty');
      },
    },
  ],
};

export default examples;
