/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { withoutTrailingSlash } from './withoutTrailingSlash';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'withoutTrailingSlash',
  category: 'url',
  examples: [
    {
      title: 'Remove trailing slash',
      description: 'Strips the trailing slash from a URL path.',
      code: `withoutTrailingSlash('path/to/resource/')
// => 'path/to/resource'`,
      assert: () => {
        if (withoutTrailingSlash('path/to/resource/') !== 'path/to/resource') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
