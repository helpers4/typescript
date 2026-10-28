/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mediaTypeOfPath } from './mediaTypeOfPath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'mediaTypeOfPath',
  category: 'binary',
  examples: [
    {
      title: 'Content-Type from a path',
      description: 'Case and a query string are ignored.',
      code: `mediaTypeOfPath('/fonts/Inter.WOFF2?v=3') // => 'font/woff2'`,
      assert: () => {
        if (mediaTypeOfPath('/fonts/Inter.WOFF2?v=3') !== 'font/woff2') throw new Error('Expected font/woff2');
      },
    },
  ],
};

export default examples;
