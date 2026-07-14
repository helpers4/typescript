/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { dedent } from './dedent';

const examples: HelperExamples = {
  helper: 'dedent',
  category: 'string',
  examples: [
    {
      title: 'Write readable multi-line strings without leaking source indentation',
      description: 'Strips the common leading whitespace and the wrapping blank lines.',
      code: `dedent(\`
  Hello
    World
\`)
// => 'Hello\\n  World'`,
      assert: () => {
        const input = '\n  Hello\n    World\n';
        if (dedent(input) !== 'Hello\n  World') throw new Error('Unexpected result');
      },
    },
    {
      title: 'The minimum indentation across all lines is what gets removed',
      description: 'Lines with more indentation than the minimum keep their relative indent.',
      code: `dedent('    a\\n  b\\n      c')
// => '  a\\nb\\n    c'`,
      assert: () => {
        if (dedent('    a\n  b\n      c') !== '  a\nb\n    c') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
