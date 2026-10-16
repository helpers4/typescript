/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stripHtml } from './stripHtml';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'stripHtml',
  category: 'string',
  examples: [
    {
      title: 'Plain text from HTML',
      description: 'Removes tags and decodes entities, including &nbsp; and numeric ones.',
      code: `stripHtml('<p>Hello&nbsp;<b>world</b> &amp; co</p>')
// => 'Hello world & co'`,
      assert: () => {
        if (stripHtml('<p>Hello&nbsp;<b>world</b> &amp; co</p>') !== 'Hello world & co') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Block tags separate words',
      description: 'Paragraphs, list items and line breaks become a space so words do not stick together.',
      code: `stripHtml('<ul><li>one</li><li>two</li></ul>')
// => 'one two'`,
      assert: () => {
        if (stripHtml('<ul><li>one</li><li>two</li></ul>') !== 'one two') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
