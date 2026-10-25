/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { WeekDays, isBusinessDay, isWeekend } from '@helpers4/date';
import { RUN, consume } from '../../scripts/bench';

const monday = '2025-01-20';
const saturday = '2025-01-18';
const uaeWeekend = [WeekDays.Friday, WeekDays.Saturday] as const;

test('weekday', async ({ bench }) => {
  await bench.compare(
    bench('isWeekend, default weekend', () => {
      consume(isWeekend(saturday));
    }),
    bench('isBusinessDay, default weekend', () => {
      consume(isBusinessDay(monday));
    }),
    bench('isBusinessDay, custom weekend days', () => {
      consume(isBusinessDay(monday, uaeWeekend));
    }),
    RUN,
  );
});
