/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { leadingSentence } from './leadingSentence'

const short = 'Hello world. More text here.'
const noTerminator = 'no terminator here '.repeat(100)
const terminatorNearEnd = `${'filler word '.repeat(100)}Done.`

describe('leadingSentence', () => {
  bench('short string, early terminator', () => {
    leadingSentence(short)
  })
  bench('long string, no terminator (full scan)', () => {
    leadingSentence(noTerminator)
  })
  bench('long string, terminator near the end', () => {
    leadingSentence(terminatorNearEnd)
  })
})
