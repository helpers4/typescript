/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { matchesMedia } from './matchesMedia';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'matchesMedia',
  category: 'browser',
  examples: [
    {
      title: 'Read a media query',
      description: 'Returns whether the document matches the query right now.',
      code: `const dark = matchesMedia('(prefers-color-scheme: dark)');`,
      assert: () => {
        if (typeof matchesMedia('(prefers-color-scheme: dark)') !== 'boolean') throw new Error('Expected a boolean');
      },
    },
    {
      title: 'Safe during server-side rendering',
      description: 'Without matchMedia (Node.js, a build step), it returns false instead of throwing.',
      code: `// on the server
matchesMedia('(min-width: 600px)') // => false`,
      assert: () => {
        const saved = globalThis.matchMedia;
        try {
          Reflect.deleteProperty(globalThis, 'matchMedia');
          if (matchesMedia('(min-width: 600px)')) throw new Error('Expected false outside a browser');
        } finally {
          if (saved) globalThis.matchMedia = saved;
        }
      },
    },
  ],
};

export default examples;
