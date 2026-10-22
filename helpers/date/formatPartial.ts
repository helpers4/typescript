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
 * Options for {@link formatPartial}.
 * @since 3.1.5
 */
export interface FormatPartialOptions {
  /** BCP 47 locale tag (default: `'en'`). Sets the month names and the order of the parts. */
  locale?: string;
  /**
   * Marker put before a year-only date, which stands for "about this year" (default: `'c.'`).
   * It is not part of `Intl`, so it does not follow `locale`: pass the word of your language
   * (`'vers'`), or `''` for the bare year.
   */
  approximate?: string;
}

/**
 * Formats a partial ISO date at the precision it was given, in UTC: a year alone is
 * approximate and reads `c. 2008`, a month `Mar 2008` and a full day `Mar 9, 2008`.
 *
 * Month names and their order follow `locale`. The marker before a year alone does not: see
 * {@link FormatPartialOptions}.
 *
 * Returns `null` when {@link parsePartial} would, or when the locale is invalid.
 *
 * @param input - A `YYYY`, `YYYY-MM` or `YYYY-MM-DD` string
 * @param options - Locale and approximate-year marker — see {@link FormatPartialOptions}
 * @returns The label, or `null`
 * @example
 * formatPartial('2008')       // => 'c. 2008'
 * formatPartial('2008-03')    // => 'Mar 2008'
 * formatPartial('2008-03-09') // => 'Mar 9, 2008'
 * formatPartial('2008', { locale: 'fr', approximate: 'vers' }) // => 'vers 2008'
 * formatPartial('2008-03-09', { locale: 'fr' })                // => '9 mars 2008'
 * formatPartial('nope')       // => null
 * @since 3.1.5
 */
export function formatPartial(input: string, options: FormatPartialOptions = {}): string | null {
  const { locale = 'en', approximate = 'c.' } = options;
  const parsed = parsePartial(input);
  if (!parsed) return null;
  let label: string;
  try {
    label = new Intl.DateTimeFormat(locale, { ...FORMATS[parsed.precision], timeZone: 'UTC' }).format(parsed.date);
  } catch {
    return null;
  }
  return parsed.precision === 'year' && approximate !== '' ? `${approximate} ${label}` : label;
}
