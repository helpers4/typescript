/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNode } from './isNode';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isNode',
  category: 'guard',
  examples: [
    {
      title: 'Branch on the runtime environment',
      description: 'Useful for isomorphic code that behaves differently on the server vs. the browser.',
      code: `if (isNode()) {
  const fs = await import('node:fs')
  // server-side file access
}`,
      assert: () => {
        if (typeof isNode() !== 'boolean') throw new Error('Expected a boolean result');
      },
    },
  ],
};

export default examples;
