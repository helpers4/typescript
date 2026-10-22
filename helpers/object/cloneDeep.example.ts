/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cloneDeep } from './cloneDeep';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'cloneDeep',
  category: 'object',
  examples: [
    {
      title: 'Clone a nested object',
      description: 'Creates a deep copy — modifying the clone does not affect the original.',
      code: `const original = { a: { b: 1 } };
const cloned = cloneDeep(original);
cloned.a.b = 2;
// original.a.b is still 1`,
      assert: () => {
        const original = { a: { b: 1 } };
        const cloned = cloneDeep(original);
        cloned.a.b = 2;
        if (original.a.b !== 1) throw new Error('Original was mutated');
        if (cloned.a.b !== 2) throw new Error('Clone was not modified');
      },
    },
  ],
};

export default examples;
