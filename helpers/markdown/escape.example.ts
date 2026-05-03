/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escape } from './escape';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'escape',
  category: 'markdown',
  examples: [
    {
      title: 'Escape special Markdown characters',
      code: `escape('**bold** and _italic_')
// => '\\\\*\\\\*bold\\\\*\\\\* and \\\\_italic\\\\_'`,
      assert: () => {
        const result = escape('**bold**');
        if (result !== '\\*\\*bold\\*\\*') throw new Error(`Got: ${result}`);
      },
    },
    {
      title: 'Safely render user input inside Markdown',
      description: 'Prevents user-supplied strings from breaking Markdown formatting.',
      code: `const userInput = '(C) [helpers4]';
const safe = escape(userInput);
// => '\\\\(C\\\\) \\\\[helpers4\\\\]'`,
      assert: () => {
        const result = escape('(C) [helpers4]');
        const expected = '\\(C\\) \\[helpers4\\]';
        if (result !== expected) throw new Error(`Expected "${expected}", got "${result}"`);
      },
    },
  ],
};

export default examples;
