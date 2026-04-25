/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { buildConventionalCommitRegex } from './buildConventionalCommitRegex';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'buildConventionalCommitRegex',
  category: 'commit',
  examples: [
    {
      title: 'Match the default Conventional Commits format',
      description: 'Returns a regex matching `type(scope)?!?: description` on the subject line.',
      code: `const regex = buildConventionalCommitRegex();
regex.test('feat(api): add endpoint') // => true
regex.test('not a commit') // => false`,
      assert: () => {
        const regex = buildConventionalCommitRegex();
        if (!regex.test('feat(api): add endpoint')) throw new Error('Expected match');
        if (regex.test('not a commit')) throw new Error('Unexpected match');
      },
    },
    {
      title: 'Restrict accepted types and require a scope',
      description: 'Constrain accepted types and force the scope segment to be present.',
      code: `const regex = buildConventionalCommitRegex({
  types: ['feat', 'fix'],
  requireScope: true,
});
regex.test('feat(api): x') // => true
regex.test('feat: missing scope') // => false
regex.test('chore(api): wrong type') // => false`,
      assert: () => {
        const regex = buildConventionalCommitRegex({ types: ['feat', 'fix'], requireScope: true });
        if (!regex.test('feat(api): x')) throw new Error('Expected match');
        if (regex.test('feat: missing scope')) throw new Error('Unexpected match');
        if (regex.test('chore(api): wrong type')) throw new Error('Unexpected match');
      },
    },
  ],
};

export default examples;
