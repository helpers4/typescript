/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { escape } from './escape'

const short = '**bold** and _italic_'
const plain = 'no special characters here at all'
const long = '**bold** _italic_ [link](url) # heading\n'.repeat(100)

describe('escape', () => {
  bench('short string with markdown syntax', () => {
    escape(short)
  })
  bench('plain string, nothing to escape', () => {
    escape(plain)
  })
  bench('long string, table cell mode', () => {
    escape(long, { cell: true })
  })
})
