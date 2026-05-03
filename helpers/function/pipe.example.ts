/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { pipe } from './pipe';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'pipe',
  category: 'function',
  examples: [
    {
      title: 'Transform a value through a pipeline',
      description: 'Functions are applied left-to-right; the output of each becomes the input of the next.',
      code: `const process = pipe(
  (x: number) => x + 1,
  (x: number) => x * 2,
  String
);
process(3); // => "8"`,
      assert: () => {
        const process = pipe(
          (x: number) => x + 1,
          (x: number) => x * 2,
          String
        );
        if (process(3) !== '8') throw new Error('Expected "8"');
      },
    },
    {
      title: 'Sanitise a string',
      code: `const sanitize = pipe(
  (s: string) => s.trim(),
  (s: string) => s.toLowerCase(),
  (s: string) => s.replace(/\\s+/g, '-')
);
sanitize('  Hello World  '); // => "hello-world"`,
      assert: () => {
        const sanitize = pipe(
          (s: string) => s.trim(),
          (s: string) => s.toLowerCase(),
          (s: string) => s.replace(/\s+/g, '-')
        );
        if (sanitize('  Hello World  ') !== 'hello-world') throw new Error('Expected "hello-world"');
      },
    },
  ],
};

export default examples;
