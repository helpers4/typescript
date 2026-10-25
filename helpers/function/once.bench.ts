/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { once } from '@helpers4/function';
import { RUN, consume } from '../../scripts/bench';

const expensiveSetup = (): number => 42;
const wrapped = once(expensiveSetup);
wrapped();

test('once', async ({ bench }) => {
  await bench.compare(
    bench('create a once-wrapped function', () => {
      consume(once(expensiveSetup));
    }),
    bench('call after first invocation (cached path)', () => {
      wrapped();
    }),
    RUN,
  );
});
