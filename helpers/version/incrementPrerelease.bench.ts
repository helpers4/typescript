/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { incrementPrerelease } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('incrementPrerelease', async ({ bench }) => {
  await bench.compare(
    bench('start new prerelease line', () => {
      consume(incrementPrerelease('1.2.3', 'alpha'));
    }),
    bench('increment same prerelease type', () => {
      consume(incrementPrerelease('1.2.4-alpha.5', 'alpha'));
    }),
    bench('switch prerelease type', () => {
      consume(incrementPrerelease('1.2.4-alpha.3', 'beta'));
    }),
    bench('with leading v prefix', () => {
      consume(incrementPrerelease('v1.2.4-alpha.0', 'alpha'));
    }),
    bench('with build metadata', () => {
      consume(incrementPrerelease('1.2.4-alpha.0+sha.abc123', 'alpha'));
    }),
    bench('null and undefined pass through', () => {
      consume(incrementPrerelease(null, 'alpha'));
      consume(incrementPrerelease(undefined, 'alpha'));
    }),
    RUN,
  );
});
