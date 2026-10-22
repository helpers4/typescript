/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest'

import { WeekDays, isBusinessDay, isWeekend } from './weekday'

const monday = '2025-01-20'
const saturday = '2025-01-18'
const uaeWeekend = [WeekDays.Friday, WeekDays.Saturday] as const

describe('weekday', () => {
  bench('isWeekend, default weekend', () => {
    isWeekend(saturday)
  })
  bench('isBusinessDay, default weekend', () => {
    isBusinessDay(monday)
  })
  bench('isBusinessDay, custom weekend days', () => {
    isBusinessDay(monday, uaeWeekend)
  })
})
