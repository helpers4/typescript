/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringifyLines } from './stringifyLines';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stringifyLines',
  category: 'json',
  examples: [
    {
      title: 'Write NDJSON / JSON Lines',
      description: 'One compact value per line, each followed by a line break.',
      code: `stringifyLines([{ id: 1 }, { id: 2 }])
// => '{"id":1}\\n{"id":2}\\n'`,
      assert: () => {
        const actual = stringifyLines([{ id: 1 }, { id: 2 }]);
        const expected = '{"id":1}\n{"id":2}\n';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Canonical lines',
      description: 'Each line in canonical form, so a log can be hashed or diffed line by line.',
      code: `stringifyLines([{ b: 1, a: 2 }], 'canonical')
// => '{"a":2,"b":1}\\n'`,
      assert: () => {
        const actual = stringifyLines([{ b: 1, a: 2 }], 'canonical');
        const expected = '{"a":2,"b":1}\n';
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
