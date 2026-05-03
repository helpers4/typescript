/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { buildStatusTable } from './buildStatusTable';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'buildStatusTable',
  category: 'ci',
  examples: [
    {
      title: 'Build a PR comment status table',
      description: 'Generates the body rows of a Markdown table for a PR validation summary.',
      code: `const rows = buildStatusTable({
  '🧾 Conventional Commits': 'success',
  '🐚 ShellCheck':           'failure',
  '🧪 Tests':                'skipped',
});

// Embed in a comment template:
// | | Job | Status |
// |:---:|-----|:------:|
// \${rows}`,
      assert: () => {
        const result = buildStatusTable({ Tests: 'success', Lint: 'failure' });
        if (!result.includes('✅')) throw new Error('Expected ✅');
        if (!result.includes('❌')) throw new Error('Expected ❌');
      },
    },
  ],
};

export default examples;
