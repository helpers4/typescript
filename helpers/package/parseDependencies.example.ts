/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parseDependencies } from './parseDependencies';

const examples: HelperExamples = {
  helper: 'parseDependencies',
  category: 'package',
  examples: [
    {
      title: 'Read a Depends field',
      description: 'Commas are AND, `|` is OR inside an entry; each alternative carries its qualifier, version and restrictions.',
      code: `parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>')
// => [
//   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
//   [
//     { name: 'python3', arch: 'any' },
//     { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64'] },
//   ],
//   [{ name: 'foo', profiles: [['!nocheck']] }],
// ]`,
      assert: () => {
        const groups = parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>');
        if (groups.length !== 3) throw new Error(`Expected 3 groups, got ${groups.length}`);
        if (groups[0]![0]!.version?.operator !== '>=') throw new Error('Expected the >= constraint');
        if (groups[1]!.length !== 2 || groups[1]![0]!.arch !== 'any') throw new Error('Expected python3:any as first alternative');
        if (groups[1]![1]!.architectures?.[0] !== 'amd64') throw new Error('Expected the amd64 restriction');
        if (groups[2]![0]!.profiles?.[0]?.[0] !== '!nocheck') throw new Error('Expected the !nocheck profile');
      },
    },
    {
      title: 'Read a multi-line field and list the package names',
      description: 'Line breaks are plain whitespace, and a trailing comma is tolerated.',
      code: `parseDependencies('debhelper-compat (= 13),\\n dh-python,\\n pkg-config,\\n').map((group) => group[0].name)
// => ['debhelper-compat', 'dh-python', 'pkg-config']`,
      assert: () => {
        const names = parseDependencies('debhelper-compat (= 13),\n dh-python,\n pkg-config,\n').map((group) => group[0]!.name);
        if (names.join() !== 'debhelper-compat,dh-python,pkg-config') throw new Error(`Unexpected names: ${names.join()}`);
      },
    },
    {
      title: 'Reject an invalid field',
      description: 'A fragment that is not valid throws a SyntaxError that quotes it.',
      code: `parseDependencies('libc6 (>= 2.34')
// => throws SyntaxError: parseDependencies: unexpected "(>= 2.34" in "libc6 (>= 2.34" ...`,
      assert: () => {
        try {
          parseDependencies('libc6 (>= 2.34');
        } catch (error) {
          if (error instanceof SyntaxError && error.message.includes('"libc6 (>= 2.34"')) return;
          throw new Error(`Expected a SyntaxError quoting the fragment, got ${String(error)}`);
        }
        throw new Error('Expected a SyntaxError');
      },
    },
  ],
};

export default examples;
