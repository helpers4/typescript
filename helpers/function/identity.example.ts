/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { identity } from './identity';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'identity',
  category: 'function',
  examples: [
    {
      title: 'Return a primitive unchanged',
      description: 'The value is returned as-is with its type preserved.',
      code: `identity(42);       // 42
identity('hello');  // 'hello'
identity(true);     // true`,
      assert: () => {
        if (identity(42) !== 42) throw new Error('Expected 42');
        if (identity('hello') !== 'hello') throw new Error('Expected hello');
      },
    },
    {
      title: 'Use as a default mapper',
      description: 'Pass identity where a transform function is required but no transformation is needed.',
      code: `[1, 2, 3].map(identity); // [1, 2, 3]`,
      assert: () => {
        const result = [1, 2, 3].map(identity);
        if (result.join() !== '1,2,3') throw new Error('Expected [1,2,3]');
      },
    },
  ],
};

export default examples;
