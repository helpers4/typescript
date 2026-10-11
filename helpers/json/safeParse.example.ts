/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParse } from './safeParse';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeParse',
  category: 'json',
  examples: [
    {
      title: 'Read JSONC without throwing',
      description: 'Same parsing as parse, but returns null on invalid input.',
      code: `safeParse('{"a": 1, /* note */}') // => { a: 1 }
safeParse('{a: 1}')               // => null`,
      assert: () => {
        if (safeParse('{a: 1}') !== null) throw new Error('Expected null');
        const actual = safeParse('{"a": 1, /* note */}');
        const expected = { a: 1 };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Fall back to defaults',
      description: 'Pass a fallback to get a usable value even when the file is broken.',
      code: `safeParse('{ broken', {})
// => {}`,
      assert: () => {
        const actual = safeParse('{ broken', {});
        const expected = {};
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
