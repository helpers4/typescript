/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJsonc } from './isJsonc';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJsonc',
  category: 'guard',
  examples: [
    {
      title: 'Check a JSONC string',
      description: 'Comments and trailing commas are fine; strict JSON is too.',
      code: `isJsonc('{"a": 1, // note\\n}') // => true
isJsonc('{"a": 1}')             // => true`,
      assert: () => {
        if (!isJsonc('{"a": 1, // note\n}') || !isJsonc('{"a": 1}')) throw new Error('Expected true');
      },
    },
    {
      title: 'JSON5 is not JSONC',
      description: 'Single quotes and unquoted keys are rejected.',
      code: `isJsonc("{'a': 1}") // => false`,
      assert: () => {
        if (isJsonc("{'a': 1}")) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
