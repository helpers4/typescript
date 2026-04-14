/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { snakeCase } from './snakeCase';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'snakeCase',
  category: 'string',
  examples: [
    {
      title: 'Convert camelCase to snake_case',
      description: 'Converts a camelCase string to snake_case.',
      code: `snakeCase('myVariableName')
// => 'my_variable_name'`,
      assert: () => {
        if (snakeCase('myVariableName') !== 'my_variable_name') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Convert kebab-case to snake_case',
      description: 'Also handles kebab-case and other formats.',
      code: `snakeCase('my-component-name')
// => 'my_component_name'`,
      assert: () => {
        if (snakeCase('my-component-name') !== 'my_component_name') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
