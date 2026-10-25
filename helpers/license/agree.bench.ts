/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { agree } from '@helpers4/license';
import { RUN, consume } from '../../scripts/bench';

test('agree', async ({ bench }) => {
  await bench.compare(
    bench('matching families', () => {
      consume(agree('GPL3', 'GPL-3.0-or-later'));
    }),
    bench('conflicting families', () => {
      consume(agree('BSD-2-Clause', 'Apache-2.0'));
    }),
    bench('one side non-informative', () => {
      consume(agree('custom', 'MIT'));
    }),
    RUN,
  );
});
