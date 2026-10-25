/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { escapeHtml } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const short = '<script>alert("xss")</script>';
const plain = 'no special characters here at all';
const long = '<div class="a">&amp;</div>'.repeat(200);

test('escapeHtml', async ({ bench }) => {
  await bench.compare(
    bench('short string with special chars', () => {
      consume(escapeHtml(short));
    }),
    bench('plain string, nothing to escape', () => {
      consume(escapeHtml(plain));
    }),
    bench('long string with many special chars', () => {
      consume(escapeHtml(long));
    }),
    RUN,
  );
});
