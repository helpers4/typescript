/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { normalizeTimestamp } from './timestamp';

/**
 * Safely creates a Date object from various input types
 * @param input - String, number, or Date input
 * @returns Valid Date object or null if invalid
 */
export function safeDate(input: string | number | Date | null | undefined): Date | null {
  if (input === null || input === undefined || input === '' || input === 0) {
    return null;
  }

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const normalized = normalizeTimestamp(input);
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === 'string') {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  // All valid input types are handled above
  // This point should never be reached with proper TypeScript types
  return null;
}

/**
 * Formats a date to ISO string or returns null
 * @param input - Date input
 * @returns ISO string or null
 */
export function dateToISOString(input: string | number | Date | null | undefined): string | null {
  const date = safeDate(input);
  return date ? date.toISOString() : null;
}
