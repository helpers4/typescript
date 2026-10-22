/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { equalsShallow } from './equalsShallow';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'equalsShallow',
  category: 'object',
  examples: [
    {
      title: 'Compare two equal objects',
      description: 'Uses JSON.stringify for a fast comparison.',
      code: `equalsShallow({ a: 1, b: 2 }, { a: 1, b: 2 })
// => true`,
      assert: () => {
        if (!equalsShallow({ a: 1, b: 2 }, { a: 1, b: 2 })) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
