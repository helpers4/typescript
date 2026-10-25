/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { safeJsonParse } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const smallJson = '{"a":1,"b":2}';
const largeJson = JSON.stringify(
  Object.fromEntries(Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i])),
);
const invalidJson = '{invalid';

test('safeJsonParse', async ({ bench }) => {
  await bench.compare(
    bench('small valid JSON', () => {
      consume(safeJsonParse(smallJson));
    }),
    bench('large valid JSON (1000 keys)', () => {
      consume(safeJsonParse(largeJson));
    }),
    bench('invalid JSON (throw + catch path)', () => {
      consume(safeJsonParse(invalidJson, {}));
    }),
    RUN,
  );
});
