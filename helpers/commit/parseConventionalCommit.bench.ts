/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { parseConventionalCommit } from './parseConventionalCommit'

const subjectOnly = 'feat(array): add flatMap helper'
const withBodyAndFooter =
  'fix(date): handle invalid timestamp\n\n' +
  'Some explanation of the fix goes here, across a couple of lines\n' +
  'of body text describing the change in more detail.\n\n' +
  'BREAKING CHANGE: the old behavior is removed\n' +
  'Co-Authored-By: someone <someone@example.com>'
const nonConventional = 'update stuff'

describe('parseConventionalCommit', () => {
  bench('subject line only', () => {
    parseConventionalCommit(subjectOnly)
  })
  bench('subject + body + footer', () => {
    parseConventionalCommit(withBodyAndFooter)
  })
  bench('non-conventional message (early return)', () => {
    parseConventionalCommit(nonConventional)
  })
})
