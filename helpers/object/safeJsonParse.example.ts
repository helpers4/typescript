/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeJsonParse } from './safeJsonParse';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeJsonParse',
  category: 'object',
  examples: [
    {
      title: 'Parse valid JSON',
      description: 'Returns the parsed value when the input is valid JSON.',
      code: `safeJsonParse<{ a: number }>('{"a":1}')
// => { a: 1 }`,
      assert: () => {
        const result = safeJsonParse<{ a: number }>('{"a":1}');
        if (result?.a !== 1) throw new Error('Expected { a: 1 }');
      },
    },
    {
      title: 'Return null on invalid input',
      description: 'Returns null instead of throwing when JSON is malformed.',
      code: `safeJsonParse('invalid')
// => null`,
      assert: () => {
        if (safeJsonParse('invalid') !== null) throw new Error('Expected null');
      },
    },
    {
      title: 'Use a fallback value',
      description: 'Returns the provided fallback when parsing fails.',
      code: `safeJsonParse('invalid', [])
// => []`,
      assert: () => {
        const result = safeJsonParse('invalid', [] as number[]);
        if (!Array.isArray(result) || result.length !== 0) throw new Error('Expected []');
      },
    },
  ],
};

export default examples;
