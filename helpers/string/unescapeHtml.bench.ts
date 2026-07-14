/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { unescapeHtml } from './unescapeHtml'

const short = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
const plain = 'no entities here at all'
const long = '&lt;div&gt;&amp;&lt;/div&gt;'.repeat(200)

describe('unescapeHtml', () => {
  bench('short string with entities', () => {
    unescapeHtml(short)
  })
  bench('plain string, nothing to unescape', () => {
    unescapeHtml(plain)
  })
  bench('long string with many entities', () => {
    unescapeHtml(long)
  })
})
