/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { stringify } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('stringify', async ({ bench }) => {
  await bench.compare(
    bench('core version only', () => {
      consume(stringify({ scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] }));
    }),
    bench('with prerelease and build metadata', () => {
      consume(stringify({
        scheme: 'semver',
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['beta'],
        build: ['exp', 'sha', '5114f85'],
      }));
    }),
    RUN,
  );
});
