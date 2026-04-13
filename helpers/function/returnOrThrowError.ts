/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNotNullish } from './isNotNullish';

/**
 * Return a value or throw an error if null or undefined.
 *
 * @param value A possible non-defined value.
 * @param error The error message to throw.
 * @returns A defined value or an error.
 * @since 1.0.0
 */
export function returnOrThrowError<T>(value: T | undefined | null, error: string): T {
  if (isNotNullish(value)) {
    return value;
  }
  throw new Error(error);
}
