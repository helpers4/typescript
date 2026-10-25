/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { compare } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('compare', async ({ bench }) => {
  await bench.compare(
    bench('simple core versions', () => {
      consume(compare('1.2.3', '1.2.4'));
    }),
    bench('prerelease versions, multiple identifiers', () => {
      consume(compare('1.0.0-alpha.1.2.3', '1.0.0-alpha.1.2.4'));
    }),
    bench('equal versions', () => {
      consume(compare('1.2.3', '1.2.3'));
    }),
    RUN,
  );
});
