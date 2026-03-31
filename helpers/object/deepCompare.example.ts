/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { deepCompare } from './deepCompare';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'deepCompare',
  category: 'object',
  examples: [
    {
      title: 'Compare nested objects',
      description: 'Deeply compares two objects, returning true when they are structurally equal.',
      code: `deepCompare({ a: { b: 1 } }, { a: { b: 1 } })
// => true`,
      assert: () => {
        if (!deepCompare({ a: { b: 1 } }, { a: { b: 1 } })) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect deep differences',
      description: 'Returns a detailed diff object when nested values differ.',
      code: `deepCompare({ a: { b: 1 } }, { a: { b: 2 } })
// => { a: { b: false } }`,
      assert: () => {
        const result = deepCompare({ a: { b: 1 } }, { a: { b: 2 } });
        if (result === true) throw new Error('Expected differences');
      },
    },
  ],
};

export default examples;
