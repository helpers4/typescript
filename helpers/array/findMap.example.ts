/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { findMap } from './findMap';

const examples: HelperExamples = {
  helper: 'findMap',
  category: 'array',
  examples: [
    {
      title: 'Find the first transformed match',
      description: 'Returns the mapped value, not the original item — stops as soon as one is found.',
      code: `findMap([1, 2, 3, 4], n => (n % 2 === 0 ? n * 10 : undefined))
// => 20`,
      assert: () => {
        if (findMap([1, 2, 3, 4], (n) => (n % 2 === 0 ? n * 10 : undefined)) !== 20) throw new Error('Unexpected result');
      },
    },
    {
      title: 'Try several fallible lookups in priority order',
      description: 'Chain several `?? `-style lookups per item and stop at the first one that succeeds anywhere in the array.',
      code: `const byId = new Map([[2, 'b']]);
findMap([1, 2, 3], id => byId.get(id))
// => 'b'`,
      assert: () => {
        const byId = new Map([[2, 'b']]);
        if (findMap([1, 2, 3], (id) => byId.get(id)) !== 'b') throw new Error('Expected a match from the map');
      },
    },
  ],
};

export default examples;
