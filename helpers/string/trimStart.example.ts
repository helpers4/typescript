/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { trimStart } from './trimStart';
import type { HelperExamples } from '../../scripts/examples/types';

const NBSP = String.fromCharCode(0x00a0);

const examples: HelperExamples = {
  helper: 'trimStart',
  category: 'string',
  examples: [
    {
      title: 'Default mode matches String.prototype.trimStart',
      description: 'With no mode argument, behaves exactly like the native trimStart.',
      code: `trimStart('   Hello')
// => 'Hello'`,
      assert: () => {
        if (trimStart('   Hello') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
    {
      title: "Preserve non-breaking spaces with 'wrappable' mode",
      description: 'A leading non-breaking space (NBSP) is kept, since its purpose is to resist being trimmed.',
      code: `const NBSP = String.fromCharCode(160);
trimStart(NBSP + 'Hello', 'wrappable')
// => NBSP + 'Hello' (unchanged)`,
      assert: () => {
        const input = NBSP + 'Hello';
        if (trimStart(input, 'wrappable') !== input) throw new Error('Expected the NBSP to be preserved');
      },
    },
    {
      title: "Strip non-breaking spaces too with 'separator' mode",
      description: 'A wider mode than the default (whitespace) is not needed for NBSP — separator already covers it.',
      code: `const NBSP = String.fromCharCode(160);
trimStart(NBSP + 'Hello', 'separator')
// => 'Hello'`,
      assert: () => {
        const NBSP2 = String.fromCharCode(0x00a0);
        if (trimStart(NBSP2 + 'Hello', 'separator') !== 'Hello') throw new Error("Expected 'Hello'");
      },
    },
  ],
};

export default examples;
