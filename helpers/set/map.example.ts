/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { map } from './map';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'map',
  category: 'set',
  examples: [
    {
      title: 'Transform every value',
      description: 'Creates a new Set with each value transformed by a function.',
      code: `map(new Set([1, 2, 3]), value => value * 10)
// => Set(3) { 10, 20, 30 }`,
      assert: () => {
        const result = map(new Set([1, 2, 3]), (value) => value * 10);
        if (![...result].every((v) => [10, 20, 30].includes(v))) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Duplicates collapse',
      description: 'If two values transform to the same result, the Set naturally deduplicates.',
      code: `map(new Set([1, 2, 3]), () => 'same')
// => Set(1) { 'same' }`,
      assert: () => {
        const result = map(new Set([1, 2, 3]), () => 'same');
        if (result.size !== 1) throw new Error('Expected duplicates to collapse');
      },
    },
  ],
};

export default examples;
