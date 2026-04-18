/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDate } from './ensureDate';
import type { DateLike } from './types';

/**
 * Safely creates a Date object from various input types.
 *
 * @param input - String, number, or Date input
 * @returns Valid Date object or null if invalid
 * @deprecated Use {@link ensureDate} instead. `safeDate` will be removed in v3.
 * @since 1.9.0
 */
export function safeDate(input: DateLike | null | undefined): Date | null {
  return ensureDate(input);
}

/**
 * Formats a date to ISO string or returns null.
 *
 * @param input - Date input
 * @returns ISO string or null
 * @deprecated Use {@link toISO8601} from `format.ts` instead. `dateToISOString` will be removed in v3.
 * @since 1.9.0
 */
export function dateToISOString(input: DateLike | null | undefined): string | null {
  const date = ensureDate(input);
  return date ? date.toISOString() : null;
}
