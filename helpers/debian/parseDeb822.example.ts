/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parseDeb822 } from './parseDeb822';

const PACKAGES = `Package: zlib1g
Version: 1:1.2.13.dfsg-1
Depends: libc6 (>= 2.14)
Description: compression library - runtime
 zlib is a library implementing the deflate compression method.
 .
 This package includes the shared library.

Package: zlib1g-dev
Version: 1:1.2.13.dfsg-1`;

const examples: HelperExamples = {
  helper: 'parseDeb822',
  category: 'debian',
  examples: [
    {
      title: 'Read the stanzas of a Packages index',
      description: 'A blank line separates the stanzas; field names are looked up in lower case.',
      code: `const stanzas = parseDeb822(packagesText);
stanzas.map((stanza) => stanza.fields.package)
// => ['zlib1g', 'zlib1g-dev']`,
      assert: () => {
        const names = parseDeb822(PACKAGES).map((stanza) => stanza.fields.package);
        if (names.join() !== 'zlib1g,zlib1g-dev') throw new Error(`Unexpected package names: ${names.join()}`);
      },
    },
    {
      title: 'Keep a multi-line description',
      description: 'Continuation lines are joined with line breaks, and a lone " ." is a blank line.',
      code: `const [zlib] = parseDeb822(packagesText);
zlib.fields.description
// => 'compression library - runtime\\nzlib is a library implementing the deflate compression method.\\n\\nThis package includes the shared library.'`,
      assert: () => {
        const [zlib] = parseDeb822(PACKAGES);
        const expected = 'compression library - runtime\nzlib is a library implementing the deflate compression method.\n\nThis package includes the shared library.';
        if (zlib!.fields.description !== expected) throw new Error(`Unexpected description: ${zlib!.fields.description}`);
      },
    },
    {
      title: 'Keep the original spelling and the duplicates',
      description: '`entries` is the ordered record of the stanza, whatever the case of the names.',
      code: `parseDeb822('SHA256: abc\\nTag: a\\nTAG: b')[0].entries
// => [{ name: 'SHA256', value: 'abc' }, { name: 'Tag', value: 'a' }, { name: 'TAG', value: 'b' }]`,
      assert: () => {
        const [stanza] = parseDeb822('SHA256: abc\nTag: a\nTAG: b');
        if (stanza!.entries.map((entry) => entry.name).join() !== 'SHA256,Tag,TAG') throw new Error('Expected the original names');
        if (stanza!.fields.tag !== 'b') throw new Error('Expected the last duplicate to win');
      },
    },
  ],
};

export default examples;
