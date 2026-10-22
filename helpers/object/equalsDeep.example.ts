/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsDeep } from './equalsDeep';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'equalsDeep',
  category: 'object',
  examples: [
    {
      title: 'Compare nested objects',
      description: 'Recursive structural equality. Returns true when the two values are deeply equal.',
      code: `equalsDeep({ a: { b: 1 } }, { a: { b: 1 } })
// => true`,
      assert: () => {
        if (!equalsDeep({ a: { b: 1 } }, { a: { b: 1 } })) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect deep differences',
      description: 'Returns false when nested values differ.',
      code: `equalsDeep({ a: { b: 1 } }, { a: { b: 2 } })
// => false`,
      assert: () => {
        if (equalsDeep({ a: { b: 1 } }, { a: { b: 2 } })) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
