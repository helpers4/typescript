/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { analyzeCommits } from '@helpers4/commit';
import { RUN, consume } from '../../scripts/bench';

const small = [
  { subject: 'feat(array): add flatMap helper' },
  { subject: 'fix(date): handle invalid timestamp' },
];
const large = Array.from({ length: 200 }, (_, i) => ({
  subject: `fix(object): patch number ${i}`,
}));
const withBreaking = [
  ...large,
  { subject: 'feat(guard): drop legacy export', body: 'BREAKING CHANGE: removed' },
];

test('analyzeCommits', async ({ bench }) => {
  await bench.compare(
    bench('small commit list', () => {
      consume(analyzeCommits(small));
    }),
    bench('large commit list, no breaking changes', () => {
      consume(analyzeCommits(large));
    }),
    bench('large commit list, with a breaking change', () => {
      consume(analyzeCommits(withBreaking));
    }),
    RUN,
  );
});
