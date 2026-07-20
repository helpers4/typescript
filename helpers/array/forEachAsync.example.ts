/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { forEachAsync } from './forEachAsync';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'forEachAsync',
  category: 'array',
  examples: [
    {
      title: 'Upload files with a concurrency cap',
      description: 'Runs fn for its side effects only; at most `concurrency` calls at once.',
      code: `await forEachAsync(files, (file) => uploadFile(file), 3)
// uploads at most 3 files concurrently`,
      assert: async () => {
        let concurrent = 0;
        let max = 0;
        const uploaded: number[] = [];
        await forEachAsync(
          [1, 2, 3, 4, 5],
          async (file) => {
            concurrent++;
            max = Math.max(max, concurrent);
            await new Promise((r) => setTimeout(r, 5));
            uploaded.push(file);
            concurrent--;
          },
          3,
        );
        if (max > 3) throw new Error(`Expected at most 3 concurrent, got ${max}`);
        if (uploaded.length !== 5) throw new Error('Expected all 5 files to be processed');
      },
    },
  ],
};

export default examples;
