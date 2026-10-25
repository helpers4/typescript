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
      code: `parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>', 'debian')
// => [
//   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
//   [
//     { name: 'python3', arch: 'any' },
//     { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64'] },
//   ],
//   [{ name: 'foo', profiles: [['!nocheck']] }],
// ]`,
      assert: () => {
        const groups = parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>', 'debian');
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
      code: `parseDependencies('debhelper-compat (= 13),\\n dh-python,\\n pkg-config,\\n', 'debian').map((group) => group[0].name)
// => ['debhelper-compat', 'dh-python', 'pkg-config']`,
      assert: () => {
        const names = parseDependencies('debhelper-compat (= 13),\n dh-python,\n pkg-config,\n', 'debian').map((group) => group[0]!.name);
        if (names.join() !== 'debhelper-compat,dh-python,pkg-config') throw new Error(`Unexpected names: ${names.join()}`);
      },
    },
    {
      title: 'Reject an invalid field',
      description: 'A fragment that is not valid throws a SyntaxError that quotes it.',
      code: `parseDependencies('libc6 (>= 2.34', 'debian')
// => throws SyntaxError: parseDependencies: unexpected "(>= 2.34" in "libc6 (>= 2.34" ...`,
      assert: () => {
        try {
          parseDependencies('libc6 (>= 2.34', 'debian');
        } catch (error) {
          if (error instanceof SyntaxError && error.message.includes('"libc6 (>= 2.34"')) return;
          throw new Error(`Expected a SyntaxError quoting the fragment, got ${String(error)}`);
        }
        throw new Error('Expected a SyntaxError');
      },
    },
    {
      title: 'Read the obsolete < and > of old packages',
      description: 'They are refused by default; compat mode reads them as dpkg does, <= and >=.',
      code: `parseDependencies('libfoo (< 2)', 'debian', { compat: true })
// => [[{ name: 'libfoo', version: { operator: '<=', version: '2' } }]]`,
      assert: () => {
        const groups = parseDependencies('libfoo (< 2)', 'debian', { compat: true });
        if (groups[0]![0]!.version?.operator !== '<=') throw new Error('Expected <=');
      },
    },
    {
      title: 'Read an RPM Requires, with an alternative',
      description: 'Boolean dependencies (a or b) become the alternatives of a group.',
      code: `parseDependencies('glibc >= 2.28, (nginx or httpd)', 'rpm')
// => [[{ name: 'glibc', version: { operator: '>=', version: '2.28' } }], [{ name: 'nginx' }, { name: 'httpd' }]]`,
      assert: () => {
        const groups = parseDependencies('glibc >= 2.28, (nginx or httpd)', 'rpm');
        if (groups[0]![0]!.version?.version !== '2.28' || groups[1]!.length !== 2) throw new Error('Expected a versioned entry and an alternative');
      },
    },
    {
      title: 'Read a PKGBUILD depends array',
      description: 'Quotes and the surrounding parentheses of the array are accepted.',
      code: `parseDependencies("('glibc>=2.38' bash)", 'arch')
// => [[{ name: 'glibc', version: { operator: '>=', version: '2.38' } }], [{ name: 'bash' }]]`,
      assert: () => {
        const groups = parseDependencies("('glibc>=2.38' bash)", 'arch');
        if (groups.length !== 2 || groups[0]![0]!.version?.operator !== '>=') throw new Error('Expected two entries');
      },
    },
    {
      title: 'Read an Alpine depends list, with a conflict',
      description: 'A leading ! marks a package that must not be installed.',
      code: `parseDependencies('musl>=1.2 !openrc', 'alpine')
// => [[{ name: 'musl', version: { operator: '>=', version: '1.2' } }], [{ name: 'openrc', conflict: true }]]`,
      assert: () => {
        const groups = parseDependencies('musl>=1.2 !openrc', 'alpine');
        if (groups[1]![0]!.conflict !== true) throw new Error('Expected a conflict');
      },
    },
    {
      title: 'Read Python requirements',
      description: 'Extras, specifiers and the environment marker are separated; the marker is kept as written.',
      code: `parseDependencies('requests[security]>=2.8,<3 ; python_version < "3.12"', 'pep508')
// => [[{ name: 'requests', extras: ['security'], specifiers: [{ operator: '>=', version: '2.8' }, { operator: '<', version: '3' }], marker: 'python_version < "3.12"' }]]`,
      assert: () => {
        const requirement = parseDependencies('requests[security]>=2.8,<3 ; python_version < "3.12"', 'pep508')[0]![0]!;
        if (requirement.extras[0] !== 'security' || requirement.specifiers.length !== 2 || requirement.marker !== 'python_version < "3.12"') {
          throw new Error('Expected extras, two specifiers and a marker');
        }
      },
    },
  ],
};

export default examples;
