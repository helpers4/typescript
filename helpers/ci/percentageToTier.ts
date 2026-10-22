/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A percentage threshold and the icon/color/label to use once a value reaches it.
 *
 * @since 3.0.1
 */
export interface PercentageTier {
  /** The minimum percentage (inclusive) for this tier to apply. */
  min: number;
  /** An emoji or icon representing this tier. */
  icon: string;
  /** A color name, typically for a badge (e.g. shields.io color keywords). */
  color: string;
  /** A short human-readable label for this tier. */
  label: string;
}

/**
 * Default tiers, geared towards coverage/quality-gate style percentages.
 * Follows shields.io color conventions: brightgreen >= 100, green >= 90, yellow >= 80, orange >= 60.
 *
 * @since 3.0.1
 */
export const DEFAULT_PERCENTAGE_TIERS: readonly PercentageTier[] = [
  { min: 100, icon: '✅', color: 'brightgreen', label: 'perfect' },
  { min: 90, icon: '🟢', color: 'green', label: 'excellent' },
  { min: 80, icon: '🟡', color: 'yellow', label: 'good' },
  { min: 60, icon: '🟠', color: 'orange', label: 'fair' },
  { min: 0, icon: '🔴', color: 'red', label: 'poor' },
];

/**
 * Comparator to sort tiers by descending min value.
 */
const DESCENDING_MIN = (a: PercentageTier, b: PercentageTier): number => b.min - a.min;

/**
 * Maps a numeric percentage to a tier (icon, color, label) using configurable thresholds.
 *
 * Tiers are matched by their highest `min` that is `<= value`; a `value` below every tier's
 * `min` (e.g. a negative percentage, or custom tiers that don't cover down to 0) falls back to
 * the tier with the lowest `min` — there's always a match as long as `tiers` is non-empty.
 *
 * @param value - The percentage to classify (typically 0-100, but not clamped)
 * @param tiers - Threshold tiers to match against, in any order (defaults to {@link DEFAULT_PERCENTAGE_TIERS})
 * @returns The matched tier
 * @throws {RangeError} If `tiers` is empty
 * @example
 * percentageToTier(95)
 * // => { min: 90, icon: '🟢', color: 'green', label: 'excellent' }
 * @example
 * percentageToTier(42, [
 *   { min: 50, icon: '🟢', color: 'green', label: 'pass' },
 *   { min: 0, icon: '🔴', color: 'red', label: 'fail' },
 * ])
 * // => { min: 0, icon: '🔴', color: 'red', label: 'fail' }
 * @example
 * percentageToTier(-5)
 * // => { min: 0, icon: '🔴', color: 'red', label: 'poor' } (fallback to lowest tier)
 * @since 3.0.1
 */
export function percentageToTier(
  value: number,
  tiers: readonly PercentageTier[] = DEFAULT_PERCENTAGE_TIERS
): PercentageTier {
  if (tiers.length === 0) {
    throw new RangeError('percentageToTier: tiers must not be empty');
  }

  const sorted = tiers.toSorted(DESCENDING_MIN);
  const match = sorted.find(tier => value >= tier.min);
  // sorted is non-empty (checked above), so its last element (lowest min) is always defined —
  // reached when value is below every tier's min (e.g. a negative value).
  return match ?? sorted[sorted.length - 1]!;
}
