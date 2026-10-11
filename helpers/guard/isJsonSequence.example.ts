/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isJsonSequence } from './isJsonSequence';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isJsonSequence',
  category: 'guard',
  examples: [
    {
      title: 'Check a JSON text sequence',
      description: 'Records framed by the record separator U+001E.',
      code: `isJsonSequence('\\u001E{"id":1}\\n') // => true`,
      assert: () => {
        if (!isJsonSequence('\u001E{"id":1}\n')) throw new Error('Expected true');
      },
    },
    {
      title: 'Detect a truncated number',
      description: 'RFC 7464 treats a top-level number without trailing whitespace as possibly truncated.',
      code: `isJsonSequence('\\u001E12') // => false`,
      assert: () => {
        if (isJsonSequence('\u001E12')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
