/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';
import { pascalCaseKeys } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const small = { user_name: 'Alice', home_address: { zip_code: '12345' } };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ item_id: i, item_value: i * 2 })),
};

test('pascalCaseKeys', async ({ bench }) => {
  await bench.compare(
    bench('small nested object', () => {
      consume(pascalCaseKeys(small));
    }),
    bench('large array of snake_case objects (100 items)', () => {
      consume(pascalCaseKeys(large));
    }),
    RUN,
  );
});
