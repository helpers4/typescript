/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { labelize } from './labelize';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'labelize',
  category: 'string',
  examples: [
    {
      title: 'Convert kebab-case to label',
      description: 'Transforms a delimited string into a label with capitalized words.',
      code: `labelize('my-component-name')
// => 'My Component Name'`,
      assert: () => {
        if (labelize('my-component-name') !== 'My Component Name') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Convert snake_case to label',
      description: 'Also works with underscore and space delimiters.',
      code: `labelize('user_first_name')
// => 'User First Name'`,
      assert: () => {
        if (labelize('user_first_name') !== 'User First Name') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
