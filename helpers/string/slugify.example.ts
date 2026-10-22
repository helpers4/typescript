/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { slugify } from './slugify';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'slugify',
  category: 'string',
  examples: [
    {
      title: 'Create a URL-safe slug',
      description: 'Converts a string into a lowercase, hyphen-separated slug.',
      code: `slugify('Hello World!')
// => 'hello-world'`,
      assert: () => {
        if (slugify('Hello World!') !== 'hello-world') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Handle accented characters',
      description: 'Normalizes Unicode characters and strips diacritics.',
      code: `slugify('Crème brûlée')
// => 'creme-brulee'`,
      assert: () => {
        if (slugify('Crème brûlée') !== 'creme-brulee') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
