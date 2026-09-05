/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readFile, writeFile } from 'node:fs/promises';
import type { HelperExamples } from '../../scripts/examples/types';
import { withTempDir } from './withTempDir';

const examples: HelperExamples = {
  helper: 'withTempDir',
  category: 'node',
  examples: [
    {
      title: 'Do work in a scratch directory that always gets cleaned up',
      description: 'The directory is removed once fn resolves, even if fn throws.',
      code: `await withTempDir('my-tool', async (dir) => {
  await writeFile(\`\${dir}/output.txt\`, 'data');
  return readFile(\`\${dir}/output.txt\`, 'utf-8');
});
// => 'data' (the directory no longer exists once this resolves)`,
      assert: async () => {
        const result = await withTempDir('my-tool', async (dir) => {
          await writeFile(`${dir}/output.txt`, 'data');
          return readFile(`${dir}/output.txt`, 'utf-8');
        });
        if (result !== 'data') throw new Error('Unexpected file contents');
      },
    },
  ],
};

export default examples;
