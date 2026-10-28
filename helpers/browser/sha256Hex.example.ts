/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { sha256Hex } from './sha256Hex';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'sha256Hex',
  category: 'browser',
  examples: [
    {
      title: 'Content key',
      description: 'A short prefix of the digest names a piece of content.',
      code: `await sha256Hex(new TextEncoder().encode('abc'), 8) // => 'ba7816bf'`,
      assert: async () => {
        if ((await sha256Hex(new TextEncoder().encode('abc'), 8)) !== 'ba7816bf') throw new Error('Expected ba7816bf');
      },
    },
  ],
};

export default examples;
