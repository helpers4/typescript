/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'resolveRecord',
  category: 'promise',
  examples: [
    {
      title: 'Fetch data for multiple keys concurrently',
      description: 'All mapper calls run in parallel via Promise.all.',
      code: `const stars = await resolveRecord(
  ['helpers4/typescript', 'helpers4/devcontainer'],
  async (repo) => fetchRepoStars(repo)
);
// => { 'helpers4/typescript': 42, 'helpers4/devcontainer': 17 }`,
      assert: async () => {
        const result = await resolveRecord(['a', 'b'], async (k) => k.toUpperCase());
        if (result['a'] !== 'A' || result['b'] !== 'B') throw new Error('Unexpected result');
      },
    },
  ],
};

export default examples;
