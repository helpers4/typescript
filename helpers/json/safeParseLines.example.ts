/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseLines } from './safeParseLines';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeParseLines',
  category: 'json',
  examples: [
    {
      title: 'Read NDJSON without throwing',
      description: 'Returns null if any line is invalid.',
      code: `safeParseLines('1\\n2\\n') // => [1, 2]
safeParseLines('1\\n{')   // => null`,
      assert: () => {
        if (safeParseLines('1\n{') !== null) throw new Error('Expected null');
        const actual = safeParseLines('1\n2\n');
        const expected = [1, 2];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Options without a fallback',
      description: 'Pass null as the fallback to give options.',
      code: `safeParseLines('1\\n\\n2', null, { blankLines: 'fail' })
// => null (JSON Lines forbids blank lines)`,
      assert: () => {
        if (safeParseLines('1\n\n2', null, { blankLines: 'fail' }) !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
