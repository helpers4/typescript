/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { escapeHtml } from './escapeHtml'

const short = '<script>alert("xss")</script>'
const plain = 'no special characters here at all'
const long = '<div class="a">&amp;</div>'.repeat(200)

describe('escapeHtml', () => {
  bench('short string with special chars', () => {
    escapeHtml(short)
  })
  bench('plain string, nothing to escape', () => {
    escapeHtml(plain)
  })
  bench('long string with many special chars', () => {
    escapeHtml(long)
  })
})
