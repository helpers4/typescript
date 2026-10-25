/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseDeb822 } from '@helpers4/debian';
import { RUN, consume } from '../../scripts/bench';

const STANZA = `Package: zlib1g
Source: zlib
Version: 1:1.2.13.dfsg-1
Installed-Size: 158
Maintainer: Mark Brown <broonie@debian.org>
Architecture: amd64
Depends: libc6 (>= 2.14)
Description: compression library - runtime
 zlib is a library implementing the deflate compression method found
 in gzip and PKZIP.  This package includes the shared library.
 .
 This is the second paragraph.
Homepage: http://zlib.net/
SHA256: 0f1e6b3d
`;

const ONE = STANZA;
const THOUSAND = Array.from({ length: 1000 }, () => STANZA).join('\n');

test('parseDeb822', async ({ bench }) => {
  await bench.compare(
    bench('1 stanza', () => {
      consume(parseDeb822(ONE));
    }),
    bench('1000 stanzas', () => {
      consume(parseDeb822(THOUSAND));
    }),
    RUN,
  );
});
