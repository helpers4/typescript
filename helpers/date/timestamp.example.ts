/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isTimestampInSeconds, normalizeTimestamp } from './timestamp';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isTimestampInSeconds',
  category: 'date',
  examples: [
    {
      title: 'Detect a Unix timestamp in seconds',
      description: 'Returns true for timestamps that are likely in seconds (Java/Unix style).',
      code: `isTimestampInSeconds(1737290400)
// => true`,
      assert: () => {
        if (!isTimestampInSeconds(1737290400)) throw new Error('Expected true');
      },
    },
    {
      title: 'Normalize a Unix timestamp to milliseconds',
      description: 'Converts a timestamp in seconds to JavaScript milliseconds.',
      code: `normalizeTimestamp(1737290400)
// => 1737290400000`,
      assert: () => {
        const result = normalizeTimestamp(1737290400);
        if (result !== 1737290400000) throw new Error(`Expected 1737290400000, got ${result}`);
      },
    },
  ],
};

export default examples;
