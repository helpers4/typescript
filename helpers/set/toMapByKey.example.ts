/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { toMapByKey } from './toMapByKey';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'toMapByKey',
  category: 'set',
  examples: [
    {
      title: 'Turn a Set into a lookup Map',
      description: 'Builds a Map keyed by a derived value, for O(1) lookup by that key.',
      code: `toMapByKey(new Set([{ id: 'a' }, { id: 'b' }]), item => item.id)
// => Map(2) { 'a' => {...}, 'b' => {...} }`,
      assert: () => {
        const map = toMapByKey(new Set([{ id: 'a' }, { id: 'b' }]), (item) => item.id);
        if (!map.has('a') || !map.has('b')) throw new Error('Unexpected lookup result');
      },
    },
  ],
};

export default examples;
