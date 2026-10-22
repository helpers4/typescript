/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { pascalCase } from './pascalCase';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'pascalCase',
  category: 'string',
  examples: [
    {
      title: 'Convert kebab-case to PascalCase',
      description: 'Converts a kebab-case string to PascalCase.',
      code: `pascalCase('my-component')
// => 'MyComponent'`,
      assert: () => {
        if (pascalCase('my-component') !== 'MyComponent') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Convert snake_case to PascalCase',
      description: 'Also handles snake_case and other formats.',
      code: `pascalCase('user_first_name')
// => 'UserFirstName'`,
      assert: () => {
        if (pascalCase('user_first_name') !== 'UserFirstName') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
