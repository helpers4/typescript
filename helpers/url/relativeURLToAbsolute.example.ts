/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { relativeURLToAbsolute } from './relativeURLToAbsolute';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'relativeURLToAbsolute',
  category: 'url',
  examples: [
    {
      title: 'Convert a relative URL to absolute',
      description: 'Prepends the base URI to a relative path, cleaning duplicate slashes.',
      code: `relativeURLToAbsolute('/api/data')
// => 'http://localhost/api/data' (depends on document.baseURI)`,
      assert: () => {
        // Browser-only: requires document.baseURI / window.location.origin
        if (typeof document === 'undefined') return;
        const result = relativeURLToAbsolute('/api/data');
        if (!result.includes('/api/data')) throw new Error(`Expected URL to contain '/api/data', got: ${result}`);
      },
    },
  ],
};

export default examples;
