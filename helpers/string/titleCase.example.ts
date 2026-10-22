/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { titleCase } from './titleCase';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'titleCase',
  category: 'string',
  examples: [
    {
      title: 'Convert kebab-case to Title Case',
      description: 'Transforms a delimited string into Title Case.',
      code: `titleCase('my-component-name')
// => 'My Component Name'`,
      assert: () => {
        if (titleCase('my-component-name') !== 'My Component Name') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Convert camelCase to Title Case',
      description: 'Also handles camelCase by splitting on uppercase transitions.',
      code: `titleCase('queryItems')
// => 'Query Items'`,
      assert: () => {
        if (titleCase('queryItems') !== 'Query Items') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
