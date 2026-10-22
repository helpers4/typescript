/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { isConventionalCommit } from './isConventionalCommit'

const conventional = 'feat(array): add flatMap helper'
const nonConventional = 'update stuff'
const multiline = 'fix(date): handle invalid timestamp\n\nSome body text here.\n\nBREAKING CHANGE: x'

describe('isConventionalCommit', () => {
  bench('conventional subject line', () => {
    isConventionalCommit(conventional)
  })
  bench('non-conventional message', () => {
    isConventionalCommit(nonConventional)
  })
  bench('multi-line commit message', () => {
    isConventionalCommit(multiline)
  })
})
