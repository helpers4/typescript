/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { withoutLeadingSlash } from './withoutLeadingSlash';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'withoutLeadingSlash',
  category: 'url',
  examples: [
    {
      title: 'Remove leading slash',
      description: 'Strips the leading slash from a URL path.',
      code: `withoutLeadingSlash('/path/to/resource')
// => 'path/to/resource'`,
      assert: () => {
        if (withoutLeadingSlash('/path/to/resource') !== 'path/to/resource') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
