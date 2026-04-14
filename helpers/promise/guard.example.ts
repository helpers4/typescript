/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { guard } from './guard';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'guard',
  category: 'promise',
  examples: [
    {
      title: 'Fallback on parse error',
      description: 'Returns a default value when the function throws.',
      code: `const result = guard(() => JSON.parse('invalid'), {})
// => {}`,
      assert: () => {
        const result = guard(() => JSON.parse('invalid'), {});
        if (typeof result !== 'object' || result === null) throw new Error('Expected empty object');
      },
    },
    {
      title: 'Pass-through on success',
      description: 'Returns the function result when it does not throw.',
      code: `const result = guard(() => JSON.parse('{"a":1}'), {})
// => { a: 1 }`,
      assert: () => {
        const result = guard(() => JSON.parse('{"a":1}'), {}) as Record<string, number>;
        if (result.a !== 1) throw new Error(`Expected { a: 1 }, got ${JSON.stringify(result)}`);
      },
    },
  ],
};

export default examples;
