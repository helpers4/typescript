/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { unescapeHtml } from './unescapeHtml';

const examples: HelperExamples = {
  helper: 'unescapeHtml',
  category: 'string',
  examples: [
    {
      title: 'Unescape HTML entities back to their original characters',
      description: 'Inverse of escapeHtml — turns &lt;, &gt;, &amp;, &quot;, &#39; back into < > & " \'.',
      code: `unescapeHtml('&lt;b&gt;bold&lt;/b&gt;')
// => '<b>bold</b>'`,
      assert: () => {
        if (unescapeHtml('&lt;b&gt;bold&lt;/b&gt;') !== '<b>bold</b>') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Unrecognized entities are left untouched',
      description: 'Only the five entities escapeHtml produces are unescaped — not the full HTML entity set.',
      code: `unescapeHtml('a&nbsp;b')
// => 'a&nbsp;b'  (unchanged)`,
      assert: () => {
        if (unescapeHtml('a&nbsp;b') !== 'a&nbsp;b') throw new Error('Expected &nbsp; to be left untouched');
      },
    },
  ],
};

export default examples;
