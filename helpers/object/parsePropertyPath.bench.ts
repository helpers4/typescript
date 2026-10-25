/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parsePropertyPath } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

test('parsePropertyPath', async ({ bench }) => {
  await bench.compare(
    bench('simple dot path (cache hit after first call)', () => {
      consume(parsePropertyPath('a.b.c'));
    }),
    bench('mixed dot/bracket path (cache hit after first call)', () => {
      consume(parsePropertyPath('layers[1].name.value'));
    }),
    bench('distinct dynamic paths (cache miss every call)', () => {
      consume(parsePropertyPath(`a.b.c.${Math.random()}`));
    }),
    RUN,
  );
});
