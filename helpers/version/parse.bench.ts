/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parse } from '@helpers4/version';
import { RUN, consume } from '../../scripts/bench';

test('parse', async ({ bench }) => {
  await bench.compare(
    bench('core version only', () => {
      consume(parse('1.2.3'));
    }),
    bench('with prerelease and build metadata', () => {
      consume(parse('1.0.0-beta.1+exp.sha.5114f85'));
    }),
    bench('with leading v', () => {
      consume(parse('v2.0.0-alpha.1'));
    }),
    RUN,
  );
});
