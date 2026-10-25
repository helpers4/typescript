/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unescapeHtml } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
const plain = 'no entities here at all';
const long = '&lt;div&gt;&amp;&lt;/div&gt;'.repeat(200);

test('unescapeHtml', async ({ bench }) => {
  await bench.compare(
    bench('short string with entities', () => {
      consume(unescapeHtml(short));
    }),
    bench('plain string, nothing to unescape', () => {
      consume(unescapeHtml(plain));
    }),
    bench('long string with many entities', () => {
      consume(unescapeHtml(long));
    }),
    RUN,
  );
});
