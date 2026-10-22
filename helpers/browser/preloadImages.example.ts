/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { preloadImages } from './preloadImages';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'preloadImages',
  category: 'browser',
  examples: [
    {
      title: 'Preload the next screens',
      description: 'Each URL gets its own result, like Promise.allSettled: a broken image does not stop the others.',
      code: `const results = await preloadImages(['/screens/a.png', '/screens/b.png']);
const failed = results.filter((result) => result.status === 'rejected');`,
      assert: async () => {
        const results = await preloadImages([]);
        if (results.length !== 0) throw new Error('Expected no result for no URL');
      },
    },
    {
      title: 'Limit concurrent downloads',
      description: 'concurrency caps how many images load at the same time (6 by default).',
      code: `await preloadImages(thumbnails, { concurrency: 2 });`,
      assert: async () => {
        const results = await preloadImages([], { concurrency: 2 });
        if (!Array.isArray(results)) throw new Error('Expected an array');
      },
    },
  ],
};

export default examples;
