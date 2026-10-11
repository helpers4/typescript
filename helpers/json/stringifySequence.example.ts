/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringifySequence } from './stringifySequence';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stringifySequence',
  category: 'json',
  examples: [
    {
      title: 'Write a JSON text sequence',
      description: 'Each value is framed as RS, JSON text, line feed (RFC 7464).',
      code: `stringifySequence([{ id: 1 }, 2])
// => '\\u001E{"id":1}\\n\\u001E2\\n'`,
      assert: () => {
        const actual = stringifySequence([{ id: 1 }, 2]);
        const expected = '\u001E{"id":1}\n\u001E2\n';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Canonical records',
      description: 'Each record in canonical form.',
      code: `stringifySequence([{ b: 1, a: 2 }], 'canonical')
// => '\\u001E{"a":2,"b":1}\\n'`,
      assert: () => {
        const actual = stringifySequence([{ b: 1, a: 2 }], 'canonical');
        const expected = '\u001E{"a":2,"b":1}\n';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
