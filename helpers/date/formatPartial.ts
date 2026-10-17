/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePartial } from './parsePartial';
import type { PartialDatePrecision } from './parsePartial';

const FORMATS: Record<PartialDatePrecision, Intl.DateTimeFormatOptions> = {
  year: { year: 'numeric' },
  month: { month: 'short', year: 'numeric' },
  day: { month: 'short', day: 'numeric', year: 'numeric' },
};

/**
 * Formats a partial ISO date at the precision it was given, in English and UTC: an approximate
 * year reads `c. 2008`, a month `Mar 2008` and a full day `Mar 9, 2008`.
 *
 * Returns `null` when {@link parsePartial} would.
 *
 * @param input - A `YYYY`, `YYYY-MM` or `YYYY-MM-DD` string
 * @returns The label, or `null`
 * @example
 * formatPartial('2008')       // => 'c. 2008'
 * formatPartial('2008-03')    // => 'Mar 2008'
 * formatPartial('2008-03-09') // => 'Mar 9, 2008'
 * formatPartial('nope')       // => null
 * @since next
 */
export function formatPartial(input: string): string | null {
  const parsed = parsePartial(input);
  if (!parsed) return null;
  const label = new Intl.DateTimeFormat('en', { ...FORMATS[parsed.precision], timeZone: 'UTC' }).format(parsed.date);
  return parsed.precision === 'year' ? `c. ${label}` : label;
}
