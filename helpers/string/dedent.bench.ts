/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { dedent } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const small = '\n  Hello\n    World\n';
const large = `\n${'  line of indented text\n'.repeat(500)}`;

test('dedent', async ({ bench }) => {
  await bench.compare(
    bench('small multi-line string', () => {
      consume(dedent(small));
    }),
    bench('large multi-line string (500 lines)', () => {
      consume(dedent(large));
    }),
    RUN,
  );
});
