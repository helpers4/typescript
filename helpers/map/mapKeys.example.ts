/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapKeys } from './mapKeys';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mapKeys',
  category: 'map',
  examples: [
    {
      title: 'Uppercase every key',
      description: 'Creates a new Map with transformed keys and unchanged values.',
      code: `mapKeys(new Map([['a', 1], ['b', 2]]), key => key.toUpperCase())
// => Map(2) { 'A' => 1, 'B' => 2 }`,
      assert: () => {
        const result = mapKeys(new Map([['a', 1], ['b', 2]]), (key) => key.toUpperCase());
        if (result.get('A') !== 1 || result.get('B') !== 2) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
