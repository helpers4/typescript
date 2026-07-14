/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isWeakSet } from './isWeakSet';

const examples: HelperExamples = {
  helper: 'isWeakSet',
  category: 'guard',
  examples: [
    {
      title: 'Check whether a value is a WeakSet',
      description: 'Distinguishes WeakSet from the regular (iterable) Set.',
      code: `isWeakSet(new WeakSet()) // => true
isWeakSet(new Set())     // => false`,
      assert: () => {
        if (!isWeakSet(new WeakSet())) throw new Error('Expected a WeakSet to pass');
        if (isWeakSet(new Set())) throw new Error('Expected a Set to fail');
      },
    },
    {
      title: 'Arrays are not WeakSets',
      description: 'Only real WeakSet instances pass.',
      code: `isWeakSet([1, 2, 3])
// => false`,
      assert: () => {
        if (isWeakSet([1, 2, 3])) throw new Error('Expected an array to fail');
      },
    },
  ],
};

export default examples;
