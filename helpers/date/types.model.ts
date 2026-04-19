/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * An object that exposes an epoch timestamp in milliseconds.
 *
 * This structural type is satisfied by `Temporal.Instant` and
 * `Temporal.ZonedDateTime` (and any future object that carries the same
 * property), so callers can pass Temporal values without importing them.
 *
 * @since 2.0.0
 */
export interface EpochMilliseconds {
  readonly epochMilliseconds: number;
}

/**
 * A value that can be converted to a Date.
 *
 * - `Date` — used as-is (validated for Invalid Date)
 * - `number` — treated as a timestamp (seconds or milliseconds, auto-detected);
 *   `0` is treated as invalid and produces `null` in {@link ensureDate}
 * - `string` — parsed via `new Date(string)`
 * - `EpochMilliseconds` — any object with a `epochMilliseconds` property
 *   (e.g. `Temporal.Instant`, `Temporal.ZonedDateTime`)
 *
 * // TODO: When the Temporal API reaches Stage 4 and is available without
 * // flags in all major runtimes, consider narrowing the union to the
 * // concrete Temporal types for stricter type-checking.
 *
 * @since 2.0.0
 */
export type DateLike = Date | number | string | EpochMilliseconds;
