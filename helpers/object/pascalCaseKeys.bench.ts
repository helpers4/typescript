/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { pascalCaseKeys } from './pascalCaseKeys';

const small = { user_name: 'Alice', home_address: { zip_code: '12345' } };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ item_id: i, item_value: i * 2 })),
};

describe('pascalCaseKeys', () => {
  bench('small nested object', () => {
    pascalCaseKeys(small);
  });
  bench('large array of snake_case objects (100 items)', () => {
    pascalCaseKeys(large);
  });
});
