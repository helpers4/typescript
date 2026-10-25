/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { isKnown } from '@helpers4/license';
import { RUN, consume } from '../../scripts/bench';

test('isKnown', async ({ bench }) => {
  await bench.compare(
    bench('known license', () => {
      consume(isKnown('MIT'));
    }),
    bench('unknown license', () => {
      consume(isKnown('custom:Acme End User License'));
    }),
    RUN,
  );
});
