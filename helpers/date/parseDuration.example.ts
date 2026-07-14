/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parseDuration } from './parseDuration';

const examples: HelperExamples = {
  helper: 'parseDuration',
  category: 'date',
  examples: [
    {
      title: 'Parse a compact duration string into milliseconds',
      description: 'The inverse of formatDuration() — accepts the same "1h 23m 45s" style output.',
      code: `parseDuration('1h 23m 45s')
// => 5025000`,
      assert: () => {
        if (parseDuration('1h 23m 45s') !== 5_025_000) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Returns null for an unparseable string',
      description: 'Lets you branch on parse failure instead of silently getting 0 or NaN.',
      code: `parseDuration('not a duration')
// => null`,
      assert: () => {
        if (parseDuration('not a duration') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
