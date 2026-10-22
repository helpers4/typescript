/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { kebabCase } from './kebabCase';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'kebabCase',
  category: 'string',
  examples: [
    {
      title: 'Convert camelCase to kebab-case',
      description: 'Converts a camelCase string to kebab-case.',
      code: `kebabCase('myComponentName')
// => 'my-component-name'`,
      assert: () => {
        if (kebabCase('myComponentName') !== 'my-component-name') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
