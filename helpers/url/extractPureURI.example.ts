/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { extractPureURI } from './extractPureURI';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'extractPureURI',
  category: 'url',
  examples: [
    {
      title: 'Remove query parameters and fragments',
      description: 'Strips everything after ? or # from the URL.',
      code: `extractPureURI('https://example.com/path?query=1#section')
// => 'https://example.com/path'`,
      assert: () => {
        const result = extractPureURI('https://example.com/path?query=1#section');
        if (result !== 'https://example.com/path') throw new Error(`Unexpected: ${result}`);
      },
    },
  ],
};

export default examples;
