/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isBrowser } from './isBrowser';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isBrowser',
  category: 'guard',
  examples: [
    {
      title: 'Branch on the runtime environment',
      description: 'Useful for isomorphic code that behaves differently in the browser vs. Node.js.',
      code: `if (isBrowser()) {
  localStorage.setItem('key', 'value')
} else {
  // Node.js / server-side fallback
}`,
      assert: () => {
        if (typeof isBrowser() !== 'boolean') throw new Error('Expected a boolean result');
      },
    },
  ],
};

export default examples;
