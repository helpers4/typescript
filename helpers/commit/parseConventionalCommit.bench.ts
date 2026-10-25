/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseConventionalCommit } from '@helpers4/commit';
import { RUN, consume } from '../../scripts/bench';

const subjectOnly = 'feat(array): add flatMap helper';
const withBodyAndFooter =
  'fix(date): handle invalid timestamp\n\n' +
  'Some explanation of the fix goes here, across a couple of lines\n' +
  'of body text describing the change in more detail.\n\n' +
  'BREAKING CHANGE: the old behavior is removed\n' +
  'Co-Authored-By: someone <someone@example.com>';
const nonConventional = 'update stuff';

test('parseConventionalCommit', async ({ bench }) => {
  await bench.compare(
    bench('subject line only', () => {
      consume(parseConventionalCommit(subjectOnly));
    }),
    bench('subject + body + footer', () => {
      consume(parseConventionalCommit(withBodyAndFooter));
    }),
    bench('non-conventional message (early return)', () => {
      consume(parseConventionalCommit(nonConventional));
    }),
    RUN,
  );
});
