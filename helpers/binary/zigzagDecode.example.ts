/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { zigzagDecode } from './zigzagDecode';


const examples: HelperExamples = {
  helper: 'zigzagDecode',
  category: 'binary',
  examples: [
    {
      title: 'Recover the signed value',
      description: 'The inverse of zigzagEncode.',
      code: `zigzagDecode(1n) // => -1n
zigzagDecode(2n) // => 1n`,
      assert: () => {
        if (zigzagDecode(1n) !== -1n || zigzagDecode(2n) !== 1n) throw new Error('Expected -1n and 1n');
      },
    },
    {
      title: 'Decode a varint payload',
      description: 'Read the unsigned varint first, then undo the zigzag mapping.',
      code: `zigzagDecode(300n) // => 150n`,
      assert: () => {
        if (zigzagDecode(300n) !== 150n) throw new Error('Expected 150n');
      },
    },
  ],
};

export default examples;
