/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escapeTableCell } from './escapeTableCell';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'escapeTableCell',
  category: 'markdown',
  examples: [
    {
      title: 'Escape a string for use in a Markdown table cell',
      code: `escapeTableCell('foo | bar')    // => 'foo \\\\| bar'
escapeTableCell('line1\\nline2') // => 'line1 line2'
escapeTableCell('a\\\\b')         // => 'a\\\\\\\\b'`,
      assert: () => {
        if (escapeTableCell('foo | bar') !== 'foo \\| bar') throw new Error('pipe');
        if (escapeTableCell('line1\nline2') !== 'line1 line2') throw new Error('newline');
      },
    },
  ],
};

export default examples;
