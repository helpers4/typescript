/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { paginate } from './paginate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'paginate',
  category: 'promise',
  examples: [
    {
      title: 'Collect every page',
      description: 'Pages are requested in order until one is shorter than pageSize.',
      code: `const all = [1, 2, 3, 4, 5];
await paginate((page) => Promise.resolve(all.slice((page - 1) * 2, page * 2)), { pageSize: 2 })
// => [1, 2, 3, 4, 5] (3 requests)`,
      assert: async () => {
        const all = [1, 2, 3, 4, 5];
        const result = await paginate((page) => Promise.resolve(all.slice((page - 1) * 2, page * 2)), { pageSize: 2 });
        if (result.join() !== '1,2,3,4,5') throw new Error(`Unexpected result: ${result.join()}`);
      },
    },
    {
      title: 'Cap the number of pages',
      description: 'maxPages protects against a source that never runs out.',
      code: `await paginate((page) => Promise.resolve([page]), { maxPages: 3 })
// => [1, 2, 3]`,
      assert: async () => {
        const result = await paginate((page) => Promise.resolve([page]), { maxPages: 3 });
        if (result.join() !== '1,2,3') throw new Error(`Unexpected result: ${result.join()}`);
      },
    },
  ],
};

export default examples;
