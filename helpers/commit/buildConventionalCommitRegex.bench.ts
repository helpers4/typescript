/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { buildConventionalCommitRegex } from './buildConventionalCommitRegex'

describe('buildConventionalCommitRegex', () => {
  bench('no constraints', () => {
    buildConventionalCommitRegex()
  })
  bench('constrained types and scopes', () => {
    buildConventionalCommitRegex({
      types: ['feat', 'fix', 'docs', 'refactor', 'test', 'chore'],
      scopes: ['array', 'object', 'string', 'date', 'guard'],
      requireScope: true,
    })
  })
})
