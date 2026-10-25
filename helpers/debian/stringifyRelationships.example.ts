/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parseRelationships } from './parseRelationships';
import { stringifyRelationships } from './stringifyRelationships';

const examples: HelperExamples = {
  helper: 'stringifyRelationships',
  category: 'debian',
  examples: [
    {
      title: 'Write relationships as a field value',
      description: 'Entries are joined with ", " and alternatives with " | ".',
      code: `stringifyRelationships([
  [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
  [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
])
// => 'libc6 (>= 2.34), python3:any | python3'`,
      assert: () => {
        const text = stringifyRelationships([
          [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
          [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
        ]);
        if (text !== 'libc6 (>= 2.34), python3:any | python3') throw new Error(`Unexpected text: ${text}`);
      },
    },
    {
      title: 'Normalise a field after editing it',
      description: 'Parse, change the groups, write them back in canonical spacing.',
      code: `const groups = parseRelationships('libc6 (>=2.34) ,\\n  foo [ amd64 ]');
groups.push([{ name: 'bar', profiles: [['!nocheck']] }]);
stringifyRelationships(groups)
// => 'libc6 (>= 2.34), foo [amd64], bar <!nocheck>'`,
      assert: () => {
        const groups = parseRelationships('libc6 (>=2.34) ,\n  foo [ amd64 ]');
        groups.push([{ name: 'bar', profiles: [['!nocheck']] }]);
        const text = stringifyRelationships(groups);
        if (text !== 'libc6 (>= 2.34), foo [amd64], bar <!nocheck>') throw new Error(`Unexpected text: ${text}`);
      },
    },
  ],
};

export default examples;
