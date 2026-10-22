/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compact } from './compact';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'compact',
  category: 'array',
  examples: [
    {
      title: 'Remove falsy values',
      description: 'Removes all falsy values (false, null, undefined, 0, "", NaN) from an array.',
      code: `compact([0, 1, false, 2, '', 3, null, undefined, NaN])
// => [1, 2, 3]`,
      assert: () => {
        const result = compact([0, 1, false, 2, '', 3, null, undefined, NaN]);
        if (result.length !== 3) throw new Error(`Expected 3, got ${result.length}`);
      },
    },
    {
      title: 'Filter nullable strings',
      description: 'Useful to clean up arrays with null/undefined gaps.',
      code: `compact(['hello', null, 'world', undefined, ''])
// => ['hello', 'world']`,
      assert: () => {
        const result = compact(['hello', null, 'world', undefined, '']);
        if (result.length !== 2) throw new Error(`Expected 2, got ${result.length}`);
      },
    },
  ],
};

export default examples;
