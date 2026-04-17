/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { set } from './set';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'set',
  category: 'object',
  examples: [
    {
      title: 'Set a nested property',
      description: 'Creates intermediate objects as needed along the dot-notated path.',
      code: `set({}, 'a.b.c', 42)
// => { a: { b: { c: 42 } } }`,
      assert: () => {
        const result = set({}, 'a.b.c', 42);
        if ((result as { a: { b: { c: number } } }).a?.b?.c !== 42) throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
