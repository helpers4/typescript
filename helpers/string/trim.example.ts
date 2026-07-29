/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trim } from './trim';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'trim',
  category: 'string',
  examples: [
    {
      title: 'Default mode matches String.prototype.trim',
      description: 'With no mode argument, behaves exactly like the native trim.',
      code: `trim('   Hello   ')
// => 'Hello'`,
      assert: () => {
        if (trim('   Hello   ') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
    {
      title: "Preserve non-breaking spaces on both ends with 'wrappable' mode",
      description: 'Non-breaking spaces (NBSP) at either end are kept, since their purpose is to resist trimming.',
      code: `const NBSP = String.fromCharCode(160);
trim(NBSP + 'Hello' + NBSP, 'wrappable')
// => NBSP + 'Hello' + NBSP (unchanged)`,
      assert: () => {
        const NBSP = String.fromCharCode(0x00a0);
        const input = NBSP + 'Hello' + NBSP;
        if (trim(input, 'wrappable') !== input) throw new Error('Expected the NBSP to be preserved on both ends');
      },
    },
    {
      title: "Strip zero-width characters on both ends with 'unicode' mode",
      description: 'The widest mode removes zero-width joiners/spaces String.prototype.trim leaves alone.',
      code: `const ZWSP = String.fromCharCode(0x200b);
trim(ZWSP + 'Hello' + ZWSP, 'unicode')
// => 'Hello'`,
      assert: () => {
        const ZWSP = String.fromCharCode(0x200b);
        if (trim(ZWSP + 'Hello' + ZWSP, 'unicode') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
  ],
};

export default examples;
