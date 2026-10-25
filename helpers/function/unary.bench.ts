/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { unary } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const unaryParseInt = unary(parseInt);

test('unary', async ({ bench }) => {
  await bench.compare(
    bench('build a unary-restricted function', () => {
      consume(unary(parseInt));
    }),
    bench('call a pre-built unary-restricted function', () => {
      unaryParseInt('42');
    }),
    RUN,
  );
});
