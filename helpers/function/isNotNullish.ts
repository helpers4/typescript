/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isNullish } from '../type/isNullish';

/**
 * Check if a given value is defined and not null (not nullish).
 * @param value - The value to check
 * @returns True if value is neither null nor undefined
 * @deprecated Use `!isNullish(value)` from `@helpers4/type` instead.
 * @since 1.0.0
 */
export function isNotNullish<T>(value: T | undefined | null): value is T {
  return !isNullish(value);
}

/**
 * @deprecated Renamed to {@link isNotNullish}. Use `!isNullish(value)` from `@helpers4/type` instead.
 */
export const isDefinedAndNotNull = isNotNullish;

