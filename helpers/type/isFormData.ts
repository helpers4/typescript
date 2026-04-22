/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a FormData instance.
 *
 * Useful for filtering or type-narrowing in a functional pipeline:
 * `values.filter(isFormData)`
 *
 * @param value - The value to check
 * @returns True if value is a FormData
 * @example
 * isFormData(new FormData()) // => true
 * isFormData({})             // => false
 * isFormData(null)           // => false
 * @since next
 */
export function isFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}
