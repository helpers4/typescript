/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { buildConventionalCommitRegex } from '@helpers4/commit';
import { RUN, consume } from '../../scripts/bench';

test('buildConventionalCommitRegex', async ({ bench }) => {
  await bench.compare(
    bench('no constraints', () => {
      consume(buildConventionalCommitRegex());
    }),
    bench('constrained types and scopes', () => {
      consume(buildConventionalCommitRegex({
        types: ['feat', 'fix', 'docs', 'refactor', 'test', 'chore'],
        scopes: ['array', 'object', 'string', 'date', 'guard'],
        requireScope: true,
      }));
    }),
    RUN,
  );
});
