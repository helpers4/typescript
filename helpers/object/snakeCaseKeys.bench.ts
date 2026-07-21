/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { snakeCaseKeys } from './snakeCaseKeys';

const small = { userName: 'Alice', homeAddress: { zipCode: '12345' } };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ itemId: i, itemValue: i * 2 })),
};

describe('snakeCaseKeys', () => {
  bench('small nested object', () => {
    snakeCaseKeys(small);
  });
  bench('large array of camelCase objects (100 items)', () => {
    snakeCaseKeys(large);
  });
});
