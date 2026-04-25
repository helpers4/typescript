/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isConventionalCommit } from './isConventionalCommit';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isConventionalCommit',
  category: 'commit',
  examples: [
    {
      title: 'Validate a commit subject',
      description: 'Returns `true` when the first line follows the Conventional Commits format.',
      code: `isConventionalCommit('feat(api): add endpoint') // => true
isConventionalCommit('hello world') // => false`,
      assert: () => {
        if (!isConventionalCommit('feat(api): add endpoint')) throw new Error('Expected true');
        if (isConventionalCommit('hello world')) throw new Error('Expected false');
      },
    },
    {
      title: 'Restrict accepted types',
      description: 'Reject any commit whose type is not in the supplied allowlist.',
      code: `isConventionalCommit('chore: x', { types: ['feat', 'fix'] }) // => false
isConventionalCommit('feat: x', { types: ['feat', 'fix'] }) // => true`,
      assert: () => {
        if (isConventionalCommit('chore: x', { types: ['feat', 'fix'] })) throw new Error('Expected false');
        if (!isConventionalCommit('feat: x', { types: ['feat', 'fix'] })) throw new Error('Expected true');
      },
    },
  ],
};

export default examples;
