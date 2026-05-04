/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { countBy } from './countBy';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'countBy',
  category: 'array',
  examples: [
    {
      title: 'Count by parity',
      description: 'Groups items by the string key returned by the callback and counts occurrences.',
      code: `countBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd')
// => { odd: 3, even: 2 }`,
      assert: () => {
        const result = countBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));
        if (result['odd'] !== 3 || result['even'] !== 2) throw new Error('Unexpected counts');
      },
    },
    {
      title: 'Count commit types',
      description: 'Use any string transform as the grouping key.',
      code: `const commits = ['feat: add x', 'fix: bug', 'feat: add y'];
countBy(commits, msg => msg.split(':')[0])
// => { feat: 2, fix: 1 }`,
      assert: () => {
        const commits = ['feat: add x', 'fix: bug', 'feat: add y'];
        const result = countBy(commits, (msg) => msg.split(':')[0]!);
        if (result['feat'] !== 2) throw new Error('Expected feat:2');
      },
    },
  ],
};

export default examples;
