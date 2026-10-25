/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { obfuscate } from './obfuscate';

const examples: HelperExamples = {
  helper: 'obfuscate',
  category: 'string',
  examples: [
    {
      title: 'Hide an address from scrapers',
      description: 'Done at build time; the page holds the token, and the link is rebuilt on click. Not security.',
      code: `obfuscate('me@example.com')
// => 'bW9jLmVscG1heGVAZW0'`,
      assert: () => {
        if (obfuscate('me@example.com') !== 'bW9jLmVscG1heGVAZW0') throw new Error('Expected bW9jLmVscG1heGVAZW0');
      },
    },
  ],
};

export default examples;
