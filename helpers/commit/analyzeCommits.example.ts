/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { analyzeCommits } from './analyzeCommits';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'analyzeCommits',
  category: 'commit',
  examples: [
    {
      title: 'Suggest a semver bump from a list of commits',
      description: 'Walks through commits and suggests `major`, `minor`, or `patch` based on Conventional Commits.',
      code: `analyzeCommits([
  { subject: 'feat: add login' },
  { subject: 'fix: handle null' },
])
// => { suggestedBump: 'minor', hasFeatures: true, hasFixes: true, ... }`,
      assert: () => {
        const result = analyzeCommits([
          { subject: 'feat: add login' },
          { subject: 'fix: handle null' },
        ]);
        if (result.suggestedBump !== 'minor') throw new Error('Expected minor');
      },
    },
    {
      title: 'Promote to major on breaking change',
      description: 'A `!` marker or a `BREAKING CHANGE:` footer always promotes the suggestion to `major`.',
      code: `analyzeCommits([{ subject: 'feat!: drop v1 API' }]).suggestedBump
// => 'major'`,
      assert: () => {
        const result = analyzeCommits([{ subject: 'feat!: drop v1 API' }]);
        if (result.suggestedBump !== 'major') throw new Error('Expected major');
      },
    },
  ],
};

export default examples;
