/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isFalsy } from './isFalsy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isFalsy',
  category: 'type',
  examples: [
    {
      title: 'Check falsy values',
      description: 'Returns true for all falsy values: false, null, undefined, 0, "", NaN.',
      code: `isFalsy(0)         // => true
isFalsy('')        // => true
isFalsy(null)      // => true
isFalsy('hello')   // => false`,
      assert: () => {
        if (!isFalsy(0)) throw new Error('0 should be falsy');
        if (!isFalsy('')) throw new Error('"" should be falsy');
        if (!isFalsy(null)) throw new Error('null should be falsy');
        if (isFalsy('hello')) throw new Error('"hello" should not be falsy');
      },
    },
  ],
};

export default examples;
