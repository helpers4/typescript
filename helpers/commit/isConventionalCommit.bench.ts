/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { isConventionalCommit } from '@helpers4/commit';
import { RUN, consume } from '../../scripts/bench';

const conventional = 'feat(array): add flatMap helper';
const nonConventional = 'update stuff';
const multiline = 'fix(date): handle invalid timestamp\n\nSome body text here.\n\nBREAKING CHANGE: x';

test('isConventionalCommit', async ({ bench }) => {
  await bench.compare(
    bench('conventional subject line', () => {
      consume(isConventionalCommit(conventional));
    }),
    bench('non-conventional message', () => {
      consume(isConventionalCommit(nonConventional));
    }),
    bench('multi-line commit message', () => {
      consume(isConventionalCommit(multiline));
    }),
    RUN,
  );
});
