/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { withTrailingSlash } from './withTrailingSlash';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'withTrailingSlash',
  category: 'url',
  examples: [
    {
      title: 'Add a trailing slash',
      description: 'Ensures the URL ends with a forward slash.',
      code: `withTrailingSlash('path/to/resource')
// => 'path/to/resource/'`,
      assert: () => {
        if (withTrailingSlash('path/to/resource') !== 'path/to/resource/') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
