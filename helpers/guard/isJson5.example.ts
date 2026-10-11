/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJson5 } from './isJson5';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJson5',
  category: 'guard',
  examples: [
    {
      title: 'Check a JSON5 string',
      description: 'Unquoted keys, single quotes, hexadecimal numbers and trailing commas are JSON5.',
      code: `isJson5("{ name: 'app', retries: 0x3, }") // => true`,
      assert: () => {
        if (!isJson5("{ name: 'app', retries: 0x3, }")) throw new Error('Expected true');
      },
    },
    {
      title: 'Keys that are not identifiers need quotes',
      description: 'A dash is not allowed in an unquoted key.',
      code: `isJson5('{ my-key: 1 }')   // => false
isJson5('{ "my-key": 1 }') // => true`,
      assert: () => {
        if (isJson5('{ my-key: 1 }')) throw new Error('Expected false');
        if (!isJson5('{ "my-key": 1 }')) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
