/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseConventionalCommit } from './parseConventionalCommit';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parseConventionalCommit',
  category: 'commit',
  examples: [
    {
      title: 'Parse a Conventional Commits subject',
      description: 'Extracts type, scope, breaking flag, and description.',
      code: `parseConventionalCommit('feat(api)!: add v2')
// => { type: 'feat', scope: 'api', breaking: true, description: 'add v2', body: '', footer: '' }`,
      assert: () => {
        const result = parseConventionalCommit('feat(api)!: add v2');
        if (!result || result.type !== 'feat' || result.scope !== 'api' || !result.breaking) {
          throw new Error('Unexpected result');
        }
      },
    },
    {
      title: 'Detect breaking changes from the footer',
      description: 'A `BREAKING CHANGE:` footer flags the commit as breaking even without the `!` marker.',
      code: `parseConventionalCommit('feat: add option\\n\\nBREAKING CHANGE: drops old config').breaking
// => true`,
      assert: () => {
        const result = parseConventionalCommit('feat: add option\n\nBREAKING CHANGE: drops old config');
        if (!result || !result.breaking) throw new Error('Expected breaking=true');
      },
    },
    {
      title: 'Returns null on a non-conventional message',
      description: 'Non-matching subjects return `null` rather than throwing.',
      code: `parseConventionalCommit('hello world') // => null`,
      assert: () => {
        if (parseConventionalCommit('hello world') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
