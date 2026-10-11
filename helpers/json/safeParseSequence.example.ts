/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseSequence } from './safeParseSequence';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeParseSequence',
  category: 'json',
  examples: [
    {
      title: 'Read a sequence without throwing',
      description: 'Returns null if any record is invalid.',
      code: `safeParseSequence('\\u001E1\\n') // => [1]
safeParseSequence('\\u001E{\\n') // => null`,
      assert: () => {
        if (safeParseSequence('\u001E{\n') !== null) throw new Error('Expected null');
        const actual = safeParseSequence('\u001E1\n');
        const expected = [1];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Provide a fallback',
      description: 'The fallback is returned on invalid input.',
      code: `safeParseSequence('\\u001E{\\n', [])
// => []`,
      assert: () => {
        const actual = safeParseSequence('\u001E{\n', []);
        const expected: unknown[] = [];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
