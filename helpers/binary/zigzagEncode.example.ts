/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { zigzagEncode } from './zigzagEncode';


const examples: HelperExamples = {
  helper: 'zigzagEncode',
  category: 'binary',
  examples: [
    {
      title: 'Keep small negative numbers small',
      description: 'Zigzag interleaves negatives and positives, so a varint stays short for values near zero.',
      code: `zigzagEncode(-1n) // => 1n
zigzagEncode(1n)  // => 2n`,
      assert: () => {
        if (zigzagEncode(-1n) !== 1n || zigzagEncode(1n) !== 2n) throw new Error('Expected 1n and 2n');
      },
    },
    {
      title: 'Cover the whole signed 64-bit range',
      description: 'The most negative value maps to the largest unsigned one.',
      code: `zigzagEncode(-(1n << 63n)) // => 18446744073709551615n`,
      assert: () => {
        if (zigzagEncode(-(1n << 63n)) !== 18446744073709551615n) throw new Error('Expected 2^64 - 1');
      },
    },
  ],
};

export default examples;
