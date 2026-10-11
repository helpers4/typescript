/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringify } from './stringify';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stringify',
  category: 'json',
  examples: [
    {
      title: 'Pretty-print by default',
      description: 'Indented with 2 spaces, like a hand-written config file.',
      code: `stringify({ name: 'app', tags: ['a'] })
// => '{\\n  "name": "app",\\n  "tags": [\\n    "a"\\n  ]\\n}'`,
      assert: () => {
        const actual = stringify({ name: 'app', tags: ['a'] });
        const expected = '{\n  "name": "app",\n  "tags": [\n    "a"\n  ]\n}';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Compact output',
      description: 'indent: 0 gives a single line, like JSON.stringify(value).',
      code: `stringify({ b: 1, a: 2 }, { indent: 0 })
// => '{"b":1,"a":2}'`,
      assert: () => {
        const actual = stringify({ b: 1, a: 2 }, { indent: 0 });
        const expected = '{"b":1,"a":2}';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Canonical JSON (RFC 8785)',
      description: 'Sorted keys and no whitespace: equal values always give the same bytes, ready to hash or sign.',
      code: `stringify({ b: 1, a: 2 }, 'canonical')
// => '{"a":2,"b":1}'`,
      assert: () => {
        const actual = stringify({ b: 1, a: 2 }, 'canonical');
        const expected = '{"a":2,"b":1}';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
