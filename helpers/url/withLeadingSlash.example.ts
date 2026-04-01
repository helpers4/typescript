/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { withLeadingSlash } from './withLeadingSlash';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'withLeadingSlash',
  category: 'url',
  examples: [
    {
      title: 'Add a leading slash',
      description: 'Ensures the URL starts with a forward slash.',
      code: `withLeadingSlash('path/to/resource')
// => '/path/to/resource'`,
      assert: () => {
        if (withLeadingSlash('path/to/resource') !== '/path/to/resource') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Already has leading slash',
      description: 'Does not add a duplicate slash.',
      code: `withLeadingSlash('/already/has/slash')
// => '/already/has/slash'`,
      assert: () => {
        if (withLeadingSlash('/already/has/slash') !== '/already/has/slash') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
