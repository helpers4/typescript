/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toHex } from './toHex';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'toHex',
  category: 'binary',
  examples: [
    {
      title: 'Hex string of bytes',
      description: 'Two lowercase digits per byte.',
      code: `toHex(new Uint8Array([0, 15, 255])) // => '000fff'`,
      assert: () => {
        if (toHex(new Uint8Array([0, 15, 255])) !== '000fff') throw new Error('Expected 000fff');
      },
    },
  ],
};

export default examples;
