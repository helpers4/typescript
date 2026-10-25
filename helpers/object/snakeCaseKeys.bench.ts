/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { snakeCaseKeys } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { userName: 'Alice', homeAddress: { zipCode: '12345' } };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ itemId: i, itemValue: i * 2 })),
};

test('snakeCaseKeys', async ({ bench }) => {
  await bench.compare(
    bench('small nested object', () => {
      consume(snakeCaseKeys(small));
    }),
    bench('large array of camelCase objects (100 items)', () => {
      consume(snakeCaseKeys(large));
    }),
    RUN,
  );
});
