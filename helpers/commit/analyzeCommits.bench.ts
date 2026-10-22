/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { analyzeCommits } from './analyzeCommits'

const small = [
  { subject: 'feat(array): add flatMap helper' },
  { subject: 'fix(date): handle invalid timestamp' },
]
const large = Array.from({ length: 200 }, (_, i) => ({
  subject: `fix(object): patch number ${i}`,
}))
const withBreaking = [
  ...large,
  { subject: 'feat(guard): drop legacy export', body: 'BREAKING CHANGE: removed' },
]

describe('analyzeCommits', () => {
  bench('small commit list', () => {
    analyzeCommits(small)
  })
  bench('large commit list, no breaking changes', () => {
    analyzeCommits(large)
  })
  bench('large commit list, with a breaking change', () => {
    analyzeCommits(withBreaking)
  })
})
