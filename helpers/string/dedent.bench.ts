/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { dedent } from './dedent'

const small = '\n  Hello\n    World\n'
const large = `\n${'  line of indented text\n'.repeat(500)}`

describe('dedent', () => {
  bench('small multi-line string', () => {
    dedent(small)
  })
  bench('large multi-line string (500 lines)', () => {
    dedent(large)
  })
})
