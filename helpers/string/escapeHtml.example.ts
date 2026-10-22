/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escapeHtml } from './escapeHtml';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'escapeHtml',
  category: 'string',
  examples: [
    {
      title: 'Escape script tags',
      description: 'Converts < > " \' & to their HTML entities to prevent XSS.',
      code: `escapeHtml('<script>alert("xss")</script>')
// => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'`,
      assert: () => {
        const result = escapeHtml('<script>alert("xss")</script>');
        if (result.includes('<')) throw new Error('Unescaped <');
        if (result !== '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
          throw new Error(`Got: ${result}`);
      },
    },
    {
      title: 'Safe interpolation in templates',
      description: 'Safe for inserting untrusted strings into HTML.',
      code: `const userInput = '<b>bold</b>';
escapeHtml(userInput) // => '&lt;b&gt;bold&lt;/b&gt;'`,
      assert: () => {
        if (escapeHtml('<b>bold</b>') !== '&lt;b&gt;bold&lt;/b&gt;')
          throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
