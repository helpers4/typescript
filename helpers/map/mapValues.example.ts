/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapValues } from './mapValues';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mapValues',
  category: 'map',
  examples: [
    {
      title: 'Scale every value',
      description: 'Creates a new Map with transformed values and unchanged keys.',
      code: `mapValues(new Map([['a', 1], ['b', 2]]), value => value * 10)
// => Map(2) { 'a' => 10, 'b' => 20 }`,
      assert: () => {
        const result = mapValues(new Map([['a', 1], ['b', 2]]), (value) => value * 10);
        if (result.get('a') !== 10 || result.get('b') !== 20) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
