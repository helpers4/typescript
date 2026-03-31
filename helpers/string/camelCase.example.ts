/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { camelCase } from './camelCase';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'camelCase',
  category: 'string',
  examples: [
    {
      title: 'Convert kebab-case to camelCase',
      description: 'Converts a kebab-case string to camelCase.',
      code: `camelCase('my-component-name')
// => 'myComponentName'`,
      assert: () => {
        if (camelCase('my-component-name') !== 'myComponentName') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
