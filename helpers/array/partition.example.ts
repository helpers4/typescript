/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { partition } from './partition';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'partition',
  category: 'array',
  examples: [
    {
      title: 'Split numbers by parity',
      description:
        'Splits an array into even and odd numbers using a predicate.',
      code: `partition([1, 2, 3, 4, 5], n => n % 2 === 0)
// => [[2, 4], [1, 3, 5]]`,
      assert: () => {
        const [even, odd] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
        if (even.length !== 2 || odd.length !== 3)
          throw new Error('Unexpected partition sizes');
        if (even[0] !== 2 || even[1] !== 4)
          throw new Error('Unexpected even values');
      },
    },
    {
      title: 'Separate active and inactive users',
      description:
        'Partitions an array of objects based on a boolean property.',
      code: `const users = [
  { name: 'Alice', active: true },
  { name: 'Bob', active: false },
  { name: 'Charlie', active: true },
];
partition(users, u => u.active)
// => [[Alice, Charlie], [Bob]]`,
      assert: () => {
        const users = [
          { name: 'Alice', active: true },
          { name: 'Bob', active: false },
          { name: 'Charlie', active: true },
        ];
        const [active, inactive] = partition(users, (u) => u.active);
        if (active.length !== 2)
          throw new Error(`Expected 2 active, got ${active.length}`);
        if (inactive.length !== 1)
          throw new Error(`Expected 1 inactive, got ${inactive.length}`);
      },
    },
    {
      title: 'Handle empty array',
      description: 'Returns two empty arrays when the input is empty.',
      code: `partition([], () => true)
// => [[], []]`,
      assert: () => {
        const [pass, fail] = partition([], () => true);
        if (pass.length !== 0 || fail.length !== 0)
          throw new Error('Expected two empty arrays');
      },
    },
  ],
};

export default examples;
