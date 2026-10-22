/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A value that can be converted to a Date.
 *
 * - `Date` — used as-is (validated for Invalid Date)
 * - `number` — treated as a timestamp (seconds or milliseconds, auto-detected);
 *   `0` is treated as invalid and produces `null` in {@link ensureDate}
 * - `string` — parsed via `new Date(string)`
 * - `Temporal.Instant` | `Temporal.ZonedDateTime` — read via their
 *   `epochMilliseconds` property
 *
 * @since 2.0.0
 */
export type DateLike = Date | number | string | Temporal.Instant | Temporal.ZonedDateTime;
