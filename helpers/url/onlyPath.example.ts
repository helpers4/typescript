/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onlyPath } from './onlyPath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'onlyPath',
  category: 'url',
  examples: [
    {
      title: 'Extract the path from a URL',
      description: 'Strips query parameters and fragments from a URL path.',
      code: `onlyPath('/path?query=thing#fragment')
// => '/path'`,
      assert: () => {
        if (onlyPath('/path?query=thing#fragment') !== '/path') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
