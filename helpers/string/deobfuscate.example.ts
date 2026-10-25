/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { deobfuscate } from './deobfuscate';

const examples: HelperExamples = {
  helper: 'deobfuscate',
  category: 'string',
  examples: [
    {
      title: 'Rebuild the address in the browser',
      description: 'Reverses obfuscate, in Node.js and in browsers alike.',
      code: `deobfuscate('bW9jLmVscG1heGVAZW0')
// => 'me@example.com'`,
      assert: () => {
        if (deobfuscate('bW9jLmVscG1heGVAZW0') !== 'me@example.com') throw new Error('Expected me@example.com');
      },
    },
    {
      title: 'A bad token gives null',
      description: 'It never throws, so the caller just checks for null.',
      code: `deobfuscate('not a token!')
// => null`,
      assert: () => {
        if (deobfuscate('not a token!') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
