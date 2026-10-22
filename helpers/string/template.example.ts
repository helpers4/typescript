/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { template } from './template';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'template',
  category: 'string',
  examples: [
    {
      title: 'Simple interpolation',
      description: 'Replaces {{key}} placeholders with values from the data object.',
      code: `template('Hello, {{name}}!', { name: 'Alice' })
// => 'Hello, Alice!'`,
      assert: () => {
        if (template('Hello, {{name}}!', { name: 'Alice' }) !== 'Hello, Alice!')
          throw new Error('Unexpected result');
      },
    },
    {
      title: 'Multiple placeholders',
      description: 'All matching placeholders are replaced in a single pass.',
      code: `template('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'Bob' })
// => 'Hi, Bob!'`,
      assert: () => {
        const result = template('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'Bob' });
        if (result !== 'Hi, Bob!') throw new Error(`Got: ${result}`);
      },
    },
    {
      title: 'Missing keys become empty string',
      description: 'Unknown placeholders are replaced with an empty string.',
      code: `template('Hello, {{name}}!', {})
// => 'Hello, !'`,
      assert: () => {
        if (template('Hello, {{name}}!', {}) !== 'Hello, !')
          throw new Error('Expected empty replacement');
      },
    },
  ],
};

export default examples;
