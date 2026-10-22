/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { kebabCaseKeys } from './kebabCaseKeys';

const small = { userName: 'Alice', homeAddress: { zipCode: '12345' } };
const large = {
  items: Array.from({ length: 100 }, (_, i) => ({ itemId: i, itemValue: i * 2 })),
};

describe('kebabCaseKeys', () => {
  bench('small nested object', () => {
    kebabCaseKeys(small);
  });
  bench('large array of camelCase objects (100 items)', () => {
    kebabCaseKeys(large);
  });
});
