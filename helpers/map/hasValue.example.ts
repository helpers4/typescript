/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { hasValue } from './hasValue';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'hasValue',
  category: 'map',
  examples: [
    {
      title: 'Check whether a value exists in a Map',
      description: "Unlike Map.prototype.has (which checks keys), this checks values.",
      code: `hasValue(new Map([['a', 1], ['b', 2]]), 2)
// => true`,
      assert: () => {
        if (!hasValue(new Map([['a', 1], ['b', 2]]), 2)) throw new Error('Expected true');
      },
    },
    {
      title: 'Value absent',
      description: 'Returns false when no entry has that value.',
      code: `hasValue(new Map([['a', 1]]), 99)
// => false`,
      assert: () => {
        if (hasValue(new Map([['a', 1]]), 99)) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
