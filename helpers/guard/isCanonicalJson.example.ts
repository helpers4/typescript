/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isCanonicalJson } from './isCanonicalJson';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isCanonicalJson',
  category: 'guard',
  examples: [
    {
      title: 'Check canonical JSON',
      description: 'Sorted keys, no whitespace, shortest numbers (RFC 8785).',
      code: `isCanonicalJson('{"a":1,"b":2}') // => true`,
      assert: () => {
        if (!isCanonicalJson('{"a":1,"b":2}')) throw new Error('Expected true');
      },
    },
    {
      title: 'Valid JSON is not always canonical',
      description: 'Unsorted keys, whitespace or 1.0 instead of 1 all fail.',
      code: `isCanonicalJson('{"b":2,"a":1}') // => false
isCanonicalJson('1.0')           // => false`,
      assert: () => {
        if (isCanonicalJson('{"b":2,"a":1}') || isCanonicalJson('1.0')) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
