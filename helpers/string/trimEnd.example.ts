/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trimEnd } from './trimEnd';
import type { HelperExamples } from '../../scripts/examples/types';

const NBSP = String.fromCharCode(0x00a0);

const examples: HelperExamples = {
  helper: 'trimEnd',
  category: 'string',
  examples: [
    {
      title: 'Default mode matches String.prototype.trimEnd',
      description: 'With no mode argument, behaves exactly like the native trimEnd.',
      code: `trimEnd('Hello   ')
// => 'Hello'`,
      assert: () => {
        if (trimEnd('Hello   ') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
    {
      title: "Preserve non-breaking spaces with 'wrappable' mode",
      description: 'A non-breaking space (NBSP) is kept, since its purpose is to resist being trimmed.',
      code: `const NBSP = String.fromCharCode(160);
trimEnd('Hello,' + NBSP, 'wrappable')
// => 'Hello,' + NBSP (unchanged)`,
      assert: () => {
        const input = 'Hello,' + NBSP;
        if (trimEnd(input, 'wrappable') !== input) throw new Error('Expected the NBSP to be preserved');
      },
    },
    {
      title: "Strip everything, including zero-width characters, with 'unicode' mode",
      description: 'The widest mode also removes zero-width joiners/spaces that String.prototype.trimEnd leaves alone.',
      code: `const ZWSP = String.fromCharCode(0x200b);
trimEnd('Hello' + ZWSP, 'unicode')
// => 'Hello'`,
      assert: () => {
        const ZWSP = String.fromCharCode(0x200b);
        if (trimEnd('Hello' + ZWSP, 'unicode') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
  ],
};

export default examples;
