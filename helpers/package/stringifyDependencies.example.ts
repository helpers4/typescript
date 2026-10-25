/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parseDependencies } from './parseDependencies';
import { stringifyDependencies } from './stringifyDependencies';

const examples: HelperExamples = {
  helper: 'stringifyDependencies',
  category: 'package',
  examples: [
    {
      title: 'Write relationships as a field value',
      description: 'Entries are joined with ", " and alternatives with " | ".',
      code: `stringifyDependencies([
  [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
  [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
], 'debian')
// => 'libc6 (>= 2.34), python3:any | python3'`,
      assert: () => {
        const text = stringifyDependencies([
          [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
          [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
        ], 'debian');
        if (text !== 'libc6 (>= 2.34), python3:any | python3') throw new Error(`Unexpected text: ${text}`);
      },
    },
    {
      title: 'Normalise a field after editing it',
      description: 'Parse, change the groups, write them back in canonical spacing.',
      code: `const groups = parseDependencies('libc6 (>=2.34) ,\\n  foo [ amd64 ]', 'debian');
groups.push([{ name: 'bar', profiles: [['!nocheck']] }]);
stringifyDependencies(groups, 'debian')
// => 'libc6 (>= 2.34), foo [amd64], bar <!nocheck>'`,
      assert: () => {
        const groups = parseDependencies('libc6 (>=2.34) ,\n  foo [ amd64 ]', 'debian');
        groups.push([{ name: 'bar', profiles: [['!nocheck']] }]);
        const text = stringifyDependencies(groups, 'debian');
        if (text !== 'libc6 (>= 2.34), foo [amd64], bar <!nocheck>') throw new Error(`Unexpected text: ${text}`);
      },
    },
    {
      title: 'Write another format',
      description: 'The same function writes RPM, Arch, Alpine and PEP 508 fields, each from its own dependency type.',
      code: `stringifyDependencies([[{ name: 'musl', version: { operator: '>=', version: '1.2' } }], [{ name: 'openrc', conflict: true }]], 'alpine')
// => 'musl>=1.2 !openrc'`,
      assert: () => {
        const text = stringifyDependencies([[{ name: 'musl', version: { operator: '>=', version: '1.2' } }], [{ name: 'openrc', conflict: true }]], 'alpine');
        if (text !== 'musl>=1.2 !openrc') throw new Error(`Unexpected text: ${text}`);
      },
    },
  ],
};

export default examples;
