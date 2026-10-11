/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseSequence } from './parseSequence';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parseSequence',
  category: 'json',
  examples: [
    {
      title: 'Read a JSON text sequence',
      description: 'Each record starts with the record separator U+001E, as jq --seq writes it.',
      code: `parseSequence('\\u001E{"id":1}\\n\\u001E{"id":2}\\n')
// => [{ id: 1 }, { id: 2 }]`,
      assert: () => {
        const actual = parseSequence('\u001E{"id":1}\n\u001E{"id":2}\n');
        const expected = [{ id: 1 }, { id: 2 }];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Recover from a truncated log',
      description: 'RFC 7464 recommends skipping invalid records; ask for it with invalidRecords: "skip".',
      code: `parseSequence('\\u001E{"id":1}\\n\\u001E{"id', { invalidRecords: 'skip' })
// => [{ id: 1 }]`,
      assert: () => {
        const actual = parseSequence('\u001E{"id":1}\n\u001E{"id', { invalidRecords: 'skip' });
        const expected = [{ id: 1 }];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
