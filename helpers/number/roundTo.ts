/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Rounds a number to specified decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 * @since 1.9.0
 */
export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
